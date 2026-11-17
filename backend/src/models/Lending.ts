import mongoose from "mongoose";

export type Lending = {
    readerId: mongoose.Types.ObjectId;
    bookId: mongoose.Types.ObjectId;
    barrowedDate: Date;
    dueDate: Date;
    returnDate?: Date;
    status: "borrowed" | "returned" | "overdue";
    createAt?: Date;
    updateAt?: Date;
};

const LendingSchema = new mongoose.Schema<Lending>(
    {
        readerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reader",
            required: true,
        },
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        barrowedDate: {
            type: Date,
            required: [true, "Barrowed date is required"],
        },
        dueDate: {
            type: Date,
            required: [true, "Due date is required"],
        },
        returnDate: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["borrowed", "returned", "overdue"],
            default: "borrowed",
        },
    },
    {
        timestamps: { createdAt: "createAt", updatedAt: "updateAt" },
    }
);

export const LendingModel = mongoose.model("Lending", LendingSchema);
