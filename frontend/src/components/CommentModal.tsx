import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    Divider,
    CircularProgress,
    Paper,
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
                width: '60%',
                maxWidth: 800,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box sx={{
                    p: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}>
                    <Typography variant="h5" component="h2" fontWeight="500">
                        Comments
                    </Typography>
                </Box>

                <List sx={{
                    overflow: 'auto',
                    flex: 1,
                    px: 3,
                }}>
                    {comments.map((comment) => (
                        <React.Fragment key={comment._id}>
                            <ListItem
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    py: 2,
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    fontWeight="500"
                                    sx={{ mb: 0.5 }}
                                >
                                    {comment.userName}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.primary"
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        width: '100%',
                                        mb: 1
                                    }}
                                >
                                    {comment.content}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {new Date(comment.createdAt).toLocaleString()}
                                </Typography>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        mt: 'auto',
                    }}
                >
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={loading}
                        variant="outlined"
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'background.paper',
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddComment}
                        disabled={loading || !newComment.trim()}
                        sx={{
                            px: 4,
                            py: 1,
                            borderRadius: 2,
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Post Comment'
                        )}
                    </Button>
                </Paper>
            </Box>
        </Modal>
    );
};

export default CommentModal; 