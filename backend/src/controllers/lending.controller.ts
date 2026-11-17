import { Request, Response, NextFunction } from "express";

import { APIError } from "../error/ApiError";
import { UpdateQuery } from "mongoose";
import { Lending, LendingModel } from "../models/Lending";
import { ReaderModel } from "../models/Reader";
import { BookModel } from "../models/Book";
import { sendOverdueEmail } from "../utils/mailer";


// export const createLending = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { readerId, bookId } = req.body;
//     console.log("Create Lending - readerId:", readerId, "bookId:", bookId);
//     if (!readerId || !bookId) {
//       return res.status(400).json({ message: "readerId and bookId are required" });
//     }
//     const lending = new LendingModel(req.body);
//     await lending.save();
//     res.status(201).json(lending);
//   } catch (err: any) {
//     next(err);
//   }
// };

export const createLending = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { readerId, bookId, status } = req.body;

    if (!readerId || !bookId) {
      return res.status(400).json({ message: "readerId and bookId are required" });
    }

    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (status === "borrowed") {
      if (book.copiesAvailable <= 0) {
        return res.status(400).json({ message: "No copies available for lending" });
      }
    
      book.copiesAvailable -= 1;
      await book.save();
    } else if (status === "returned") {
     
      book.copiesAvailable += 1;
      await book.save();
    }

    const lending = new LendingModel(req.body);
    await lending.save();

    res.status(201).json(lending);
  } catch (err: any) {
    next(err);
  }
};


export const getAllLendings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lendings = await LendingModel.find({})
      .populate("readerId", "name email")
      .populate("bookId", "title author");
    res.status(200).json(lendings);
  } catch (err: any) {
    next(err);
  }
};


export const getLendingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lending = await LendingModel.findById(req.params.id)
            .populate("readerId", "name email")
            .populate("bookId", "title author");

        if (!lending) {
            throw new APIError(404, "Lending record not found");
        }

        res.status(200).json(lending);
    } catch (err: any) {
        next(err);
    }
};

// export const updateLending = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const updateData: UpdateQuery<Lending> = req.body;

//         const updatedLending = await LendingModel.findOneAndUpdate(
//             { _id: req.params.id },
//             updateData,
//             {
//                 projection: undefined, rawResult: true,
//                 new: true,
//                 runValidators: true,
//             }
//         );

//         if (!updatedLending) {
//             throw new APIError(404, "Lending record not found");
//         }

//         res.status(200).json(updatedLending);
//     } catch (err: any) {
//         next(err);
//     }
// };


export const deleteLending = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await LendingModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            throw new APIError(404, "Lending record not found");
        }
        res.status(200).json({ message: "Lending successfully deleted" });
    } catch (err: any) {
        next(err);
    }
};

// export const updateLending = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const lendingId = req.params.id;
//     const updateData: UpdateQuery<Lending> = req.body;

//     const existingLending = await LendingModel.findById(lendingId);
//     if (!existingLending) {
//       throw new APIError(404, "Lending record not found");
//     }

//     const originalDueDate = existingLending.dueDate?.toISOString().split("T")[0];
//     const newDueDate = new Date(updateData.dueDate).toISOString().split("T")[0];

//     const updatedLending = await LendingModel.findByIdAndUpdate(
//       lendingId,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedLending) {
//       throw new APIError(404, "Failed to update lending");
//     }

//     // Check if dueDate was extended
//     if (originalDueDate && newDueDate && originalDueDate !== newDueDate) {
//       const reader = await ReaderModel.findById(updatedLending.readerId);
//       const book = await BookModel.findById(updatedLending.bookId);

//       if (reader && book) {
//         await sendOverdueEmail(
//           reader.email,
//           reader.name,
//           [
//             {
//               title: book.title,
//               dueDate: newDueDate,
//             },
//           ]
//         );
//         console.log(`📧 Email sent to ${reader.email} about due date extension.`);
//       }
//     }

//     res.status(200).json(updatedLending);
//   } catch (err: any) {
//     next(err);
//   }
// };
export const updateLending = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lendingId = req.params.id;
    const updateData: UpdateQuery<Lending> = req.body;

    const existingLending = await LendingModel.findById(lendingId);
    if (!existingLending) {
      throw new APIError(404, "Lending record not found");
    }

    const previousStatus = existingLending.status;
    const newStatus = updateData.status ?? previousStatus;

    const originalDueDate = existingLending.dueDate?.toISOString().split("T")[0];
    const newDueDate = updateData.dueDate
      ? new Date(updateData.dueDate).toISOString().split("T")[0]
      : originalDueDate;

    
    const updatedLending = await LendingModel.findByIdAndUpdate(
      lendingId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLending) {
      throw new APIError(404, "Failed to update lending");
    }

    if (previousStatus !== newStatus) {
      const book = await BookModel.findById(updatedLending.bookId);
      if (book) {
        if (previousStatus !== "borrowed" && newStatus === "borrowed") {
          
          if (book.copiesAvailable <= 0) {
            return res.status(400).json({ message: "No copies available to borrow" });
          }
          book.copiesAvailable -= 1;
          await book.save();
          console.log(`📉 Book borrowed. copiesAvailable decreased for '${book.title}'`);
        } else if (previousStatus !== "returned" && newStatus === "returned") {
          
          book.copiesAvailable += 1;
          await book.save();
          console.log(`📈 Book returned. copiesAvailable increased for '${book.title}'`);
        }
      }
    }

    
    if (originalDueDate !== newDueDate) {
      const reader = await ReaderModel.findById(updatedLending.readerId);
      const book = await BookModel.findById(updatedLending.bookId);

      if (reader && book) {
        await sendOverdueEmail(reader.email, reader.name, [
          { title: book.title, dueDate: newDueDate },
        ]);
        console.log(`📧 Email sent to ${reader.email} about due date extension.`);
      }
    }

    res.status(200).json(updatedLending);
  } catch (err: any) {
    next(err);
  }
};

// export const getOverdueLendings = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const now = new Date();

//     const allLendings = await LendingModel.find({
//       dueDate: { $lt: now },
//     })
//       .populate("readerId", "name email")
//       .populate("bookId", "title author");

//     const overdueLendings = allLendings.filter((lending) => {
//       if (lending.status !== "returned") {
//         return true; 
//       }

//       if (lending.returnDate && lending.returnDate > lending.dueDate) {
//         return true; 
//       }

//       return false; 
//     });

//     res.status(200).json(overdueLendings);
//   } catch (err: any) {
//     next(err);
//   }
// };

// export const getOverdueLendings = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const now = new Date();
//     console.log("Current date:", now);

//     const overdueLendings = await LendingModel.find({
//       dueDate: { $lte: now },        // <= now, includes today
//       status: { $ne: "returned" },   // exclude returned
//     })
//       .populate("readerId", "name email")
//       .populate("bookId", "title author");

//     console.log("Overdue lendings found:", overdueLendings.length);

//     res.status(200).json(overdueLendings);
//   } catch (err: any) {
//     next(err);
//   }
// };
export const getOverdueLendings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();

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
          _id: 1,
          readerId: {
            _id: "$reader._id",
            name: "$reader.name",
            email: "$reader.email",
          },
          bookId: {
            _id: "$book._id",
            title: "$book.title",
            author: "$book.author",
          },
          barrowedDate: 1,
          dueDate: 1,
          returnDate: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.status(200).json(overdueLendings);
  } catch (err: any) {
    next(err);
  }
};

export const getLendingsByReaderEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required" });
    }

    const reader = await ReaderModel.findOne({ email: email });
    if (!reader) {
      return res.status(404).json({ message: "Reader not found" });
    }

    const lendings = await LendingModel.find({ readerId: reader._id })
      .populate("readerId", "name email")
      .populate("bookId", "title author");

    res.status(200).json(lendings);
  } catch (err: any) {
    next(err);
  }
};


export const getLendingsByBookTitle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const title = req.query.title as string;
    if (!title) {
      return res.status(400).json({ message: "Title query parameter is required" });
    }

    const book = await BookModel.findOne({ title: new RegExp(title, "i") });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const lendings = await LendingModel.find({ bookId: book._id })
      .populate("readerId", "name email")
      .populate("bookId", "title author");

    res.status(200).json(lendings);
  } catch (err: any) {
    next(err);
  }
};