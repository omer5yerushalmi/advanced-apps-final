import React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Container,
} from '@mui/material';
import {
    Home,
    AddBox,
    AccountCircle,
    Logout,
} from '@mui/icons-material';

interface NavigationProps {
    onProfileClick: () => void;
    onNewPostClick: () => void;
    onHomeClick: () => void;
    onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onProfileClick, onNewPostClick, onHomeClick, onLogout }) => {
    return (
        <>
            {/* Top App Bar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: '#FFFFFF',
                    borderBottom: '1px solid',
                    borderColor: '#DBDBDB',
                }}
            >
                <Container maxWidth="md">
                    <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
                        <IconButton onClick={onLogout}>
                            <Logout sx={{ fontSize: 28 }} />
                        </IconButton>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                fontSize: '24px',
                                fontWeight: 'bold'
                            }}
                        >
                        </Typography>
                        <IconButton onClick={onNewPostClick}>
                            <AddBox sx={{ fontSize: 28 }} />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Bottom Navigation */}
            <AppBar
                position="fixed"
                color="default"
                sx={{
                    top: 'auto',
                    bottom: 0,
                    bgcolor: '#FFFFFF',
                    borderTop: '1px solid',
                    borderColor: '#DBDBDB',
                }}
                elevation={0}
            >
                <Container maxWidth="md">
                    <Toolbar sx={{ justifyContent: 'space-around', px: 0 }}>
                        <IconButton onClick={onHomeClick}>
                            <Home sx={{ fontSize: 28 }} />
                        </IconButton>
                        <IconButton
                            onClick={onProfileClick}
                            sx={{ p: 1 }}
                        >
                            <AccountCircle />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default Navigation; 