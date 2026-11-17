// models/User.ts
import mongoose, { Document, Schema } from "mongoose"

// 1. Define a TypeScript interface representing a User document in MongoDB
export interface IUser extends Document {
    name: string
    email: string
    password: string
}

// 2. Define the schema using mongoose.Schema
const userSchema = new Schema<IUser>({
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
    password: {
        type: String,
        required: true,
    },
})

// 3. Export the model
export const UserModel = mongoose.model<IUser>("User", userSchema)
