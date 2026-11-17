// controllers/mail.controller.ts
import { Request, Response, NextFunction } from "express";
import { ReaderModel } from "../models/Reader";
import { LendingModel } from "../models/Lending";
import { BookModel } from "../models/Book";
import { sendOverdueEmail } from "../utils/mailer";

export const sendDueDateReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { readerId, lendingId } = req.body;

    const reader = await ReaderModel.findById(readerId);
    if (!reader) {
      return res.status(404).json({ message: "Reader not found" });
    }

    const lending = await LendingModel.findById(lendingId);
    if (!lending) {
      return res.status(404).json({ message: "Lending not found" });
    }

    const book = await BookModel.findById(lending.bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const overdueBook = {
      title: book.title,
      dueDate: new Date(lending.dueDate).toLocaleDateString(),
    };

    await sendOverdueEmail(reader.email, reader.name, [overdueBook]);

    return res.status(200).json({ message: "Due date reminder email sent" });
  } catch (error) {
    next(error);
  }
};

// controllers/mail.controller.ts
export const sendBulkDueDateReminders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const now = new Date();

    // Step 1: Fetch all overdue lendings with reader and book details
    const overdueLendings = await LendingModel.aggregate([
      {
        $match: {
          status: "borrowed",
          dueDate: { $lt: now },
        },
      },
      {
        $lookup: {
          from: "readers",
          localField: "readerId",
          foreignField: "_id",
          as: "reader",
        },
      },
      { $unwind: "$reader" },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $project: {
          readerId: "$reader._id",
          readerName: "$reader.name",
          readerEmail: "$reader.email",
          bookTitle: "$book.title",
          dueDate: "$dueDate",
        },
      },
    ]);

    // Step 2: Group by reader and prepare email data
    const grouped: {
      [readerEmail: string]: {
        readerName: string;
        books: { title: string; dueDate: string }[];
      };
    } = {};

    overdueLendings.forEach((entry) => {
      const email = entry.readerEmail;
      const name = entry.readerName;
      const book = {
        title: entry.bookTitle,
        dueDate: new Date(entry.dueDate).toLocaleDateString(),
      };

      if (!grouped[email]) {
        grouped[email] = {
          readerName: name,
          books: [book],
        };
      } else {
        grouped[email].books.push(book);
      }
    });

    // Step 3: Send emails
    const results: { email: string; status: string }[] = [];

    for (const email in grouped) {
      const { readerName, books } = grouped[email];
      try {
        await sendOverdueEmail(email, readerName, books);
        results.push({ email, status: "sent" });
      } catch (err) {
        results.push({ email, status: "failed" });
      }
    }

    res.status(200).json({
      message: "Bulk reminders processed",
      results,
    });
  } catch (err) {
    next(err);
  }
};

