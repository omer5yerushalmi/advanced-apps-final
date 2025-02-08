import { Request, Response } from "express";
import postsService from "../services/posts-service";
import config from "../config/config";

const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const sender = req.query.sender as string;
    const data = await postsService.getAllPosts(sender);
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
      sender: req.body.sender,
      content: req.body.content,
    };

    if (Object.values(postData).every(Boolean)) {
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
    const { content } = req.body;
    const id = req.params.id;

    if (!content) {
      res.status(config.statusCode.BAD_REQUEST).json("{content} is required.");
    } else {
      const data = await postsService.updatePost(id, content);
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
