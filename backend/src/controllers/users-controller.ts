import { Request, Response } from "express";
import usersService from "../services/users-service";
import config from "../config/config";

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await usersService.getAllUsers();
    res.status(config.statusCode.SUCCESS).json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const data = await usersService.getUserById(id);
    res
      .status(data ? config.statusCode.SUCCESS : config.statusCode.NOT_FOUND)
      .json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    if (Object.values(userData).every(Boolean)) {
      const data = await usersService.createUser(userData);
      res.status(config.statusCode.SUCCESS).json(data);
    } else {
      res.status(config.statusCode.BAD_REQUEST).json("Incomplete user data provided.");
    }
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const data = await usersService.deleteUser(id);

    if (!data) {
      res.status(config.statusCode.NOT_FOUND).json("User not found");
      return;
    }

    res.status(config.statusCode.SUCCESS).json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const id = req.params.id;

    if (!email) {
      res.status(config.statusCode.BAD_REQUEST).json("<email> is required.");
      return;
    }

    const data = await usersService.updateUser(id, email);

    if (!data) {
      res.status(config.statusCode.NOT_FOUND).json("User not found");
      return;
    }

    res.status(config.statusCode.SUCCESS).json(data);
  } catch (error) {
    res.status(config.statusCode.INTERNAL_SERVER_ERROR).json((error as Error).message);
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
};
