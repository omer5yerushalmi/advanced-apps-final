import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from "../config/config";
import { User } from "../models/user";
import ApiError from "../common/api-error";

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, username, password } = req.body;

  try {
    if (!email || !password || !username) {
      throw new ApiError(config.statusCode.BAD_REQUEST, "Incomplete user data provided.");
    }

    const existingUser = await User.findOne({ 'email': email });
    if (existingUser) {
      throw new ApiError(config.statusCode.BAD_REQUEST, "User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      email,
      password: encryptedPassword,
      username,
    });

    const newUser = await user.save();
    res.status(config.statusCode.SUCCESS).json(newUser);
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new ApiError(config.statusCode.BAD_REQUEST, "Incomplete user data provided.");
    }

    const user = await User.findOne({ 'email': email });
    if (!user) {
      throw new ApiError(config.statusCode.BAD_REQUEST, "Bad email or password.");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ApiError(config.statusCode.BAD_REQUEST, "Bad email or password.");
    }

    const accessToken = await jwt.sign(
      { '_id': user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    );

    const refreshToken = await jwt.sign(
      { '_id': user._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!user.tokens) {
      user.tokens = [refreshToken];
    } else {
      user.tokens.push(refreshToken);
    }

    await user.save();
    res.status(config.statusCode.SUCCESS).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders?.split(' ')[1];

    if (!token) {
      throw new ApiError(config.statusCode.UNAUTHORIZED, "No token provided");
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
      if (err) {
        throw new ApiError(config.statusCode.FORBIDDEN, err.message);
      }

      const userId = userInfo._id;
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(config.statusCode.FORBIDDEN, "Invalid request");
      }
      if (!user.tokens.includes(token)) {
        user.tokens = [];
        await user.save();
        throw new ApiError(config.statusCode.FORBIDDEN, "Invalid request");
      }
      user.tokens.splice(user.tokens.indexOf(token), 1);
      await user.save();
      res.status(config.statusCode.SUCCESS).json({ message: "Logged out successfully" });
    })
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders?.split(' ')[1];

    if (!token) {
      throw new ApiError(config.statusCode.UNAUTHORIZED, "No token provided");
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
      if (err) {
        throw new ApiError(config.statusCode.FORBIDDEN, err.message);
      }

      const userId = userInfo._id;
      const user = await User.findById(userId);

      if (!user) {
        throw new ApiError(config.statusCode.FORBIDDEN, "Invalid request");
      }

      if (!user.tokens.includes(token)) {
        user.tokens = [""];
        await user.save();
        throw new ApiError(config.statusCode.FORBIDDEN, "Invalid request");
      }

      const accessToken = await jwt.sign(
        { '_id': user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
      );

      const newRefreshToken = await jwt.sign(
        { '_id': user._id },
        process.env.REFRESH_TOKEN_SECRET
      );

      user.tokens[user.tokens.indexOf(token)] = newRefreshToken;
      await user.save();
      res.status(config.statusCode.SUCCESS).json({ accessToken, refreshToken: newRefreshToken });
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
};
