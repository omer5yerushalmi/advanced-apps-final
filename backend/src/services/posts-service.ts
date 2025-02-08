import { Post, PostDocument } from "../models/post";
import mongoose from "mongoose";

interface PostData {
  sender: string;
  content: string;
}

const getAllPosts = async (sender?: string): Promise<PostDocument[]> => {
  if (sender) {
    return await Post.find({ sender });
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
  return await Post.create(postData);
};

const updatePost = async (id: string, content: string): Promise<PostDocument | undefined> => {
  const post = await getPostById(id);

  if (post) {
    post.content = content;
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
