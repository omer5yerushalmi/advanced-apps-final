import React from 'react';
import { Box, Avatar, Typography, Paper, Container } from '@mui/material';
import moment from 'moment';
import { User } from '../types/User';

interface UserProfileProps {
    user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Avatar
                        src={user.profileImage}
                        alt={user.name}
                        sx={{ width: 150, height: 150 }}
                    />
                    <Typography variant="h4" component="h1">
                        {user.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {user.email}
                    </Typography>
                    {user.bio && (
                        <Typography variant="body1" textAlign="center" sx={{ mt: 2 }}>
                            {user.bio}
                        </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                        Member since {moment(user.joinDate).format('MMMM YYYY')}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default UserProfile; 