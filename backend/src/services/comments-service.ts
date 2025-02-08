import { Comment, CommentDocument } from "../models/comment";
import postsService from "./posts-service";
import mongoose from "mongoose";

interface CommentData {
  post: string;
  sender: string;
  content: string;
}

const createComment = async (commentData: CommentData): Promise<CommentDocument | undefined> => {
  const post = await postsService.getPostById(commentData.post);
  if (!post) {
    return undefined;
  }
  return await Comment.create(commentData);
};

const getCommentById = async (id: string): Promise<CommentDocument | undefined> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return undefined;
  }
  return await Comment.findById(id) ?? undefined;
};

const getAllComments = async (post?: string): Promise<CommentDocument[]> => {
  if (post) {
    return await Comment.find({ post });
  }
  return await Comment.find({});
};

const updateComment = async (id: string, content: string): Promise<CommentDocument | undefined> => {
  const comment = await getCommentById(id);

  if (comment) {
    comment.content = content;
    await comment.save();
  }

  return comment;
};

const deleteComment = async (id: string): Promise<CommentDocument | undefined> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return undefined;
  }

  return await Comment.findByIdAndDelete(id) ?? undefined;
};

export default {
  createComment,
  getCommentById,
  getAllComments,
  updateComment,
  deleteComment,
};
