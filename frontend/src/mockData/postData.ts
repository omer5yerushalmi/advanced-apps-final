import { Post } from '../types/Post';

export const mockPosts: Post[] = [
    {
        _id: '1',
        userId: '1',
        userName: 'john_doe',
        text: '🌅 Perfect sunset vibes #photography #nature',
        likes: [],
        likesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '2',
        userId: '2',
        userName: 'travel_emma',
        text: '✈️ Adventure awaits! #travel #wanderlust',
        likes: [],
        likesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
]; 