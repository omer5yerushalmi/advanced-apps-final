import { Request, Response } from "express";
import commentsService from "../services/comments-service";
import config from "../config/config";

const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentData = {
      post: req.body.post,
      sender: req.body.sender,
      content: req.body.content,
    };

    if (Object.values(commentData).every(Boolean)) {
      const data = await commentsService.createComment(commentData);
      res
        .status(data ? config.statusCode.SUCCESS : config.statusCode.NOT_FOUND)
        .json(data);
    } else {
      res.status(config.statusCode.BAD_REQUEST).json("Incomplete comment data provided.");
    }
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const getCommentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const data = await commentsService.getCommentById(id);
    res
      .status(data ? config.statusCode.SUCCESS : config.statusCode.NOT_FOUND)
      .json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const getAllComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = req.query.post as string;
    const data = await commentsService.getAllComments(post);
    res.status(config.statusCode.SUCCESS).json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const id = req.params.id;

    if (!content) {
      res.status(config.statusCode.BAD_REQUEST).json("{content} is required.");
    } else {
      const data = await commentsService.updateComment(id, content);
      res.status(config.statusCode.SUCCESS).json(data);
    }
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const data = await commentsService.deleteComment(id);
    res.status(config.statusCode.SUCCESS).json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

export default {
  createComment,
  getCommentById,
  getAllComments,
  updateComment,
  deleteComment,
};
