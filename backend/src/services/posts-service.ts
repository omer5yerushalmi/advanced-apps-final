import { Post, PostDocument } from "../models/post";
import mongoose from "mongoose";

interface PostData {
  userId: string;
  userName: string;
  text: string;
  imageUrl?: string;
}

const getAllPosts = async (userId?: string): Promise<PostDocument[]> => {
  if (userId) {
    return await Post.find({ userId });
  }
  return await Post.find({});
};

const getPostById = async (id: string): Promise<PostDocument | undefined> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return undefined;
  }
  return await Post.findById(id) ?? undefined;
};

const createPost = async (postData: PostData): Promise<PostDocument> => {
  const now = new Date().toISOString();
  return await Post.create({
    ...postData,
    createdAt: now,
    updatedAt: now
  });
};

const updatePost = async (id: string, text: string, imageUrl?: string): Promise<PostDocument | undefined> => {
  const post = await getPostById(id);

  if (post) {
    post.text = text;
    if (imageUrl !== undefined) {
      post.imageUrl = imageUrl;
    }
    post.updatedAt = new Date().toISOString();
    await post.save();
  }

  return post;
};

const deletePost = async (id: string): Promise<PostDocument | undefined> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return undefined;
  }

  return await Post.findByIdAndDelete(id) ?? undefined;
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
