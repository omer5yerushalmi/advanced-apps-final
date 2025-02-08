import mongoose, { Document, Schema, model } from "mongoose";

export interface PostDocument extends Document {
  sender: string;
  content: string;
}

const postSchema = new Schema<PostDocument>({
  sender: { type: String, required: true },
  content: { type: String, required: true },
});

export const Post = model<PostDocument>("Post", postSchema);
