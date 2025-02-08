import { User, UserDocument } from "../models/user";
import mongoose from "mongoose";

interface userData {
    username: String,
    email: String,
};

const getAllUsers = async (): Promise<UserDocument[]> => {
    return await User.find({});
};

const getUserById = async (id: string): Promise<UserDocument | undefined> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return undefined;
    }
    return await User.findById(id) ?? undefined;
};

const createUser = async (userData: userData): Promise<UserDocument> => {
    return await User.create(userData);
};

const updateUser = async (id: string, email: string): Promise<UserDocument | undefined> => {
    const user = await getUserById(id);

    if (user) {
        user.email = email;
        await user.save();
    }

    return user;
};

const deleteUser = async (id: string): Promise<UserDocument | undefined> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return undefined;
    }

    return await User.findByIdAndDelete(id) ?? undefined;
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
