import mongoose from "mongoose";

export type Book = {
    title: string;
    author: string;
    description: string;
    publishYear: number;
    totalCopies: number;
    copiesAvailable: number;
    isActive?: boolean;           // ✅ Optional: useful for soft delete
    createAt?: Date;
    updateAt?: Date;
};

const BookSchema = new mongoose.Schema<Book>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        author: {
            type: String,
            required: [true, "Author is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        publishYear: {
            type: Number,
            required: [true, "Publish year is required"],
            min: [0, "Publish year must be positive"],
        },
        totalCopies: {
            type: Number,
            required: [true, "Total copies are required"],
            min: [0, "Total copies must be at least 0"],
        },
        copiesAvailable: {
            type: Number,
            required: [true, "Copies available are required"],
            min: [0, "Copies available must be at least 0"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: { createdAt: "createAt", updatedAt: "updateAt" },
    }
);

export const BookModel = mongoose.model("Book", BookSchema);
