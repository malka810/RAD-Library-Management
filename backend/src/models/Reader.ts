import mongoose from "mongoose";

export type Reader = {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    isActive?: boolean;      // ✅ new field
    createAt?: Date;
    updateAt?: Date;
};

const ReaderSchema = new mongoose.Schema<Reader>(
    {
        name: {
            type: String,
            minlength: [2, "Name must be at least 2 characters long"],
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            index: true,
            trim: true,
            lowercase: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please use a valid email address",
            ],
        },
        phone: {
            type: String,
            minlength: [10, "Phone must be at least 10 characters long"],
            required: [true, "Phone is required"],
        },
        address: {
            type: String,
            minlength: [5, "Address must be at least 5 characters long"],
            required: [true, "Address is required"],
        },
        password: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const ReaderModel = mongoose.model("Reader", ReaderSchema);
