import { Request, Response, NextFunction } from 'express';

import { APIError } from '../error/ApiError';

import { UpdateQuery } from 'mongoose';
import { Book, BookModel } from '../models/Book';

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = new BookModel(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (err: any) {
        next(err);
    }
};

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await BookModel.find({});
        res.status(200).json(books);
    } catch (err: any) {
        next(err);
    }
};

export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookModel.findById(req.params.id);
        if (!book) {
            throw new APIError(404, "Book not found");
        }
        res.status(200).json(book);
    } catch (err: any) {
        next(err);
    }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedBook = await BookModel.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            throw new APIError(404, "Book not found");
        }
        res.status(200).json({ message: "Book successfully deleted" });
    } catch (err: any) {
        next(err);
    }
};
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateData: UpdateQuery<Book> = req.body;

        const updatedBook = await BookModel.findOneAndUpdate(
            { _id: req.params.id },
            updateData,
            {
                new: true,          
                runValidators: true 
              
            }
        );

        if (!updatedBook) {
            throw new APIError(404, 'Book not found');
        }

        res.status(200).json(updatedBook);
    } catch (err: any) {
        next(err);
    }
};

export const searchBookByTitle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const title = req.query.title as string;

    if (!title) {
      return res.status(400).json({ message: "Title parameter is required" });
    }

    const book = await BookModel.findOne({ title: { $regex: new RegExp(title, "i") } });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};
