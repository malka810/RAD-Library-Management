import { BookModel } from "../models/Book";

export const updateBookCopies = async (bookId: string, change: number) => {
  const book = await BookModel.findById(bookId);
  if (!book) throw new Error("Book not found");
  book.copiesAvailable += change;
  if (book.copiesAvailable < 0) {
    throw new Error("No more copies available");
  }
  await book.save();
};
