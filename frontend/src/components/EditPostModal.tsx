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
import { Post } from '../types/Post';

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
    onEditComplete: (postId: string, newText: string, file?: File) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
    isOpen,
    onClose,
    post,
    onEditComplete
}) => {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (post) {
            setText(post.text);
            setPreviewUrl(post.imageUrl || null);
        }
    }, [post]);

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
        if (post && text.trim()) {
            onEditComplete(post._id, text.trim(), file || undefined);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="edit-post-modal"
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
                    maxWidth: 600,
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
                    <Typography variant="h6">Edit Post</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <form onSubmit={handleSubmit}>
                    <TextField
                        multiline
                        rows={4}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />

                    {/* Image Preview */}
                    {previewUrl && (
                        <Box sx={{ position: 'relative', width: 'fit-content', mb: 2 }}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: 300,
                                    objectFit: 'contain',
                                    borderRadius: 8
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
                        sx={{ width: 'fit-content', mb: 2 }}
                    >
                        {previewUrl ? 'Change Image' : 'Add Image'}
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!text.trim()}
                        fullWidth
                    >
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </Modal>
    );
};

export default EditPostModal; 