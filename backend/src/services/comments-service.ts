import { Comment, CommentDocument } from "../models/comment";
import postsService from "./posts-service";
import mongoose from "mongoose";
import { Post } from "../models/post";

interface CommentData {
  post: string;
  userId: string;
  userName: string;
  content: string;
}

const createComment = async (commentData: CommentData): Promise<CommentDocument | undefined> => {
  const post = await postsService.getPostById(commentData.post);
  if (!post) {
    return undefined;
  }

  const comment = await Comment.create(commentData);
  await Post.findByIdAndUpdate(
    commentData.post,
    { $inc: { commentsCount: 1 } }
  );

  return comment;
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

const deleteComment = async (id: string): Promise<CommentDocument | null> => {
  const comment = await Comment.findById(id);
  if (!comment) {
    return null;
  }

  await Comment.findByIdAndDelete(id);
  await Post.findByIdAndUpdate(
    comment.post,
    { $inc: { commentsCount: -1 } }
  );

  return comment;
};

export default {
  createComment,
  getCommentById,
  getAllComments,
  updateComment,
  deleteComment,
};
