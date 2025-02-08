import mongoose, { Document, Schema, model } from "mongoose";

export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    tokens: string[];
}

const userSchema = new Schema<UserDocument>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    tokens: { type: [String], default: [] }
});

export const User = model<UserDocument>("User", userSchema);
