import { Document, Schema, model } from "mongoose";
import { PostDocument } from "./post";

export interface CommentDocument extends Document {
  post: PostDocument["_id"];
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

const commentSchema = new Schema<CommentDocument>({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Comment = model<CommentDocument>("Comment", commentSchema);
