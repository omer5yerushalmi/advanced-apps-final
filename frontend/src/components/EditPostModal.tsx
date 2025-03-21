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
import { Close as CloseIcon } from '@mui/icons-material';
import { Post } from '../types/Post';

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
    onEditComplete: (postId: string, newText: string) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
    isOpen,
    onClose,
    post,
    onEditComplete
}) => {
    const [text, setText] = useState('');

    useEffect(() => {
        if (post) {
            setText(post.text);
        }
    }, [post]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (post && text.trim()) {
            onEditComplete(post._id, text.trim());
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
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!text.trim()}
                    >
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </Modal>
    );
};

export default EditPostModal; 