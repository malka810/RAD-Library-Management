import { Request, Response, NextFunction } from 'express';

import { APIError } from '../error/ApiError';

import mongoose, { UpdateQuery } from 'mongoose';
import { Reader, ReaderModel } from '../models/Reader';
import bcrypt from "bcrypt";

export const createReader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const SALT_ROUNDS = 10;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const readerData = {
      ...req.body,
      password: hashedPassword,
    };

    const reader = new ReaderModel(readerData);
    await reader.save();
    res.status(201).json(reader);
  } catch (err: any) {
    next(err);
  }
};


export const getAllReaders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const readers = await ReaderModel.find({}); // Or { isActive: true } for filtering only active
        res.status(200).json(readers);
    } catch (err: any) {
        next(err);
    }
};

export const getReaderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reader = await ReaderModel.findById(req.params.id);
        if (!reader) {
            throw new APIError(404, "Reader not found");
        }
        res.status(200).json(reader);
    } catch (err: any) {
        next(err);
    }
};

export const deleteReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedReader = await ReaderModel.findByIdAndDelete(req.params.id);
        if (!deletedReader) {
            throw new APIError(404, "Reader not found");
        }
        res.status(200).json({ message: "Reader successfully deleted" });
    } catch (err: any) {
        next(err);
    }
};
export const updateReader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateData: UpdateQuery<Reader> = { ...req.body };

    // Remove password if empty string or undefined
    if (!updateData.password) {
      delete updateData.password;
    }

    const updatedReader = await ReaderModel.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReader) {
      return res.status(404).json({ message: "Reader not found" });
    }

    return res.status(200).json(updatedReader);
  } catch (error) {
    console.error("Update Reader error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const searchReaderByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    const reader = await ReaderModel.findOne({ email: email.toLowerCase() });

    if (!reader) {
      return res.status(404).json({ message: "Reader not found" });
    }

    return res.status(200).json(reader);
  } catch (error) {
    next(error);
  }
};

export const filterReadersByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Name parameter is required" });
    }

    const readers = await ReaderModel.find({
      name: { $regex: name as string, $options: 'i' } // partial + case-insensitive
    });

    res.status(200).json(readers);
  } catch (error) {
    next(error);
  }
};
