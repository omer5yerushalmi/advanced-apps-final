import { User, UserDocument } from "../models/user";
import mongoose from "mongoose";

interface userData {
    username: string,
    email: string,
    imgUrl: string,
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

const getUserByEmail = async (email: string): Promise<UserDocument | undefined> => {
    if (!email) {
        return undefined;
    }
    return await User.findOne({ 'email': email }) ?? undefined;
};

const createUser = async (userData: userData): Promise<UserDocument> => {
    return await User.create(userData);
};

const updateUser = async (id: string, userData: userData): Promise<UserDocument | undefined> => {
    const user = await getUserById(id);
    
    if (user) {
        const oldUsername = user.username;
        if (oldUsername != userData.username){
            const user_with_username = await User.findOne({ 'username': userData.username });
            if (user_with_username)
                return undefined;
        }
        user.username = userData.username;
        user.imgUrl = userData.imgUrl;
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
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
};
