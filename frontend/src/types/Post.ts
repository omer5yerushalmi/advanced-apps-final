export interface Post {
    _id: string;
    userId: string;
    userName: string;
    text: string;
    imageUrl?: string;
    likes: string[];  // Array of user emails who liked the post
    likesCount: number;
    createdAt: string;
    updatedAt: string;
} 