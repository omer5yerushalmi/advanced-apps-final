import { Request, Response } from "express";
import postsService from "../services/posts-service";
import config from "../config/config";

const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string;
    const data = await postsService.getAllPosts(userId);
    res.status(config.statusCode.SUCCESS).json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const data = await postsService.getPostById(id);
    res
      .status(data ? config.statusCode.SUCCESS : config.statusCode.NOT_FOUND)
      .json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const base = process.env.BASE_DOMAIN;

const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, userName, text } = req.body;

    if (!userId || !userName || !text) {
      res.status(config.statusCode.BAD_REQUEST).json("Incomplete post data provided.");
      return;
    }

    let imageUrl: string | undefined;
    if (req.file) {
      imageUrl = `${base}/${req.file.path}`;
    }

    const postData = {
      userId,
      userName,
      text,
      imageUrl
    };

    const data = await postsService.createPost(postData);
    res.status(config.statusCode.SUCCESS).json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const data = await postsService.deletePost(id);
    res.status(config.statusCode.SUCCESS).json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const text = req.body.text;
    const id = req.params.id;

    if (!text) {
      res.status(config.statusCode.BAD_REQUEST).json("{text} is required.");
      return;
    }

    let imageUrl: string | undefined;
    if (req.file) {
      imageUrl = `${base}/${req.file.path}`;
    }

    const data = await postsService.updatePost(id, text, imageUrl);
    res.status(config.statusCode.SUCCESS).json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId;
    const updatedPost = await postsService.toggleLike(postId, userId);
    res.status(config.statusCode.SUCCESS).json(updatedPost);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  updatePost,
  toggleLike,
};
