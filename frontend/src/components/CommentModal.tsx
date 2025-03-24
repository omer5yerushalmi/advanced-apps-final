import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
} from '@mui/material';
import { API_CONFIG } from '../config/api';

interface Comment {
    _id: string;
    userName: string;
    content: string;
    createdAt: string;
}

interface CommentModalProps {
    open: boolean;
    onClose: () => void;
    postId: string;
}

const CommentModal: React.FC<CommentModalProps> = ({ open, onClose, postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/api/comments?post=${postId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            const data = await response.json();
            setComments(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchComments();
        }
    }, [open, postId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_CONFIG.baseURL}/api/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    post: postId,
                    userId: localStorage.getItem('userEmail'),
                    userName: localStorage.getItem('username'),
                    content: newComment,
                }),
            });

            if (response.ok) {
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                maxHeight: '80vh',
                overflow: 'auto',
            }}>
                <Typography variant="h6" component="h2" mb={2}>
                    Comments
                </Typography>

                <List>
                    {comments?.map((comment) => (
                        <React.Fragment key={comment._id}>
                            <ListItem>
                                <ListItemText
                                    primary={comment.userName}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2">
                                                {comment.content}
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="caption" color="text.secondary">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={loading}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddComment}
                        disabled={loading}
                        sx={{ mt: 1 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Post Comment'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CommentModal; 