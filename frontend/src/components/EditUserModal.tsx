import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Paper,
} from '@mui/material';
import {
    Close as CloseIcon,
    Image as ImageIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { User } from '../types/User';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onEditComplete: (userId: string, newUsername: string, email: string, newImage?: File) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
    isOpen,
    onClose,
    user,
    onEditComplete
}) => {
    const [username, setUsername] = useState('');
    const [profileImg, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setPreviewUrl(user.imgUrl || null);
        }
    }, [user]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const clearImage = () => {
        setFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user && username.trim()) {
            onEditComplete(user._id, username.trim(), user.email ,profileImg || undefined);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="edit-user-modal"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(5px)'
            }}
        >
            <Paper
                elevation={24}
                sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 500,
                    maxHeight: '90vh',
                    overflow: 'auto',
                    m: 2,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h6">Edit User</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <form onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ mr: 1, fontWeight: 500 }}>Username:</Typography>
                        <TextField
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ flexGrow: 1, maxWidth: 250 }}
                        />
                    </ Box>
                    {/* Image Preview */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        {previewUrl && (
                             <Box sx={{ position: 'relative', mb: 2 }}>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{
                                        maxWidth: 250,
                                        maxHeight: 250,
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                    }}
                                />
                                <IconButton
                                    onClick={clearImage}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.7)'
                                        }
                                    }}
                                >
                                    <DeleteIcon sx={{ color: 'white' }} />
                                </IconButton>
                            </Box>
                        )}

                        {/* Image Upload Button */}
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<ImageIcon />}
                            sx={{ width: 'fit-content' }}
                        >
                            {previewUrl ? 'Change Image' : 'Add Image'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                        </Button>
                    </ Box>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!username.trim()}
                        fullWidth
                    >
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </Modal>
    );
};

export default EditUserModal; 