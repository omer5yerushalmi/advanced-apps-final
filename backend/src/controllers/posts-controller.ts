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

const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postData = {
      userId: req.body.userId,
      userName: req.body.userName,
      text: req.body.text,
      imageUrl: req.body.imageUrl
    };

    if (postData.userId && postData.userName && postData.text) {
      const data = await postsService.createPost(postData);
      res.status(config.statusCode.SUCCESS).json(data);
    } else {
      res.status(config.statusCode.BAD_REQUEST).json("Incomplete post data provided.");
    }
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
    const { text } = req.body;
    const id = req.params.id;

    if (!text) {
      res.status(config.statusCode.BAD_REQUEST).json("{text} is required.");
    } else {
      const data = await postsService.updatePost(id, text);
      res.status(config.statusCode.SUCCESS).json(data);
    }
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
};
