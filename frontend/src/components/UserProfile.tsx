import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Paper, Container, Alert, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { User } from '../types/User';
import EditUserModal from './EditUserModal';
import { API_CONFIG } from '../config/api';

interface UserProfileProps {
    userEmail: string | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ userEmail }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
    const [error, setError] = useState<string | null>(null);
    const [displayedUser, setDisplayedUser] = useState<User | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);    
    
    // Fetch all posts initially
    useEffect(() => {
        fetchUserDetails();
    });
    
    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/api/users/email/${userEmail}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const data = await response.json();
            data.imgUrl = !data.imgUrl || data.imgUrl == 'none' ? 'avatar-image.jpg' : data.imgUrl;
            setDisplayedUser(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleEditUser = (user: User | null) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleEditComplete = async (userId: string, newUsername: string, email: string, file?: File) => {
        try {
            const formData = new FormData();
            formData.append('username', newUsername);
            formData.append('email', email);
            if (file) {
                formData.append('image', file);
            }

            const response = await fetch(`${API_CONFIG.baseURL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            const updatedUser = await response.json();

            setDisplayedUser(updatedUser);
            setIsEditModalOpen(false);
            setEditingUser(null);
        } catch (err) {
            console.error('Error updating post:', err);
            // Handle error appropriately
        }
    };

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4, mt: 2, position: 'relative' }}>
                    {/* Edit Button in the Top-Right Corner */}
                    <IconButton
                        onClick={() => handleEditUser(displayedUser)}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            color: 'grey.500',
                            '&:hover': { color: 'primary.main' }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>

                    {/* User Details (Avatar, Username, Email) */}
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Avatar
                            src={displayedUser?.imgUrl}
                            alt={displayedUser?.username}
                            sx={{ width: 150, height: 150 }}
                        />
                        <Typography variant="h4" component="h1">
                            {displayedUser?.username}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {displayedUser?.email}
                        </Typography>
                    </Box>
                </Paper>
            </Container>
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                }}
                user={editingUser}
                onEditComplete={handleEditComplete}
            />
        </Box>
        
    );
};

export default UserProfile; 