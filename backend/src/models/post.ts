import mongoose, { Document, Schema, model } from "mongoose";

export interface PostDocument extends Document {
  id: string;
  userId: string;
  userName: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const postSchema = new Schema<PostDocument>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  imageUrl: { type: String, required: false },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});

export const Post = model<PostDocument>("Post", postSchema);
