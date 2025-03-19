import React, { useState } from 'react';
import { Box } from '@mui/material';
import PostList from './PostList';
import UserProfile from './UserProfile';
import { mockUser } from '../mockData/userData';
import Navigation from './Navigation';
import CreatePostModal from './CreatePostModal';

const HomePage: React.FC = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);

    const handleProfileClick = () => {
        setShowProfile(true);
    };

    const handleHomeClick = () => {
        setShowProfile(false);
        setShowCreatePost(false);
    };

    const handleNewPostClick = () => {
        setShowCreatePost(true);
    };

    const handlePostCreated = () => {
        setShowCreatePost(false);
    };

    return (
        <Box>
            <Navigation
                onProfileClick={handleProfileClick}
                onNewPostClick={handleNewPostClick}
                onHomeClick={handleHomeClick}
            />
            <Box sx={{ pt: 8, pb: 7 }}>
                {showProfile ? (
                    <UserProfile user={mockUser} onBack={() => setShowProfile(false)} />
                ) : (
                    <PostList />
                )}
            </Box>
            <CreatePostModal
                isOpen={showCreatePost}
                onClose={() => setShowCreatePost(false)}
                userId="your-user-id"
                userName="your-username"
                onPostCreated={handlePostCreated}
            />
        </Box>
    );
};

export default HomePage; 