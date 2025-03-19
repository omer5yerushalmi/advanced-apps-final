import { useState } from 'react';
import axios from 'axios';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    CircularProgress,
    Paper,
    Stack,
} from '@mui/material';
import {
    Close as CloseIcon,
    Image as ImageIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
    onPostCreated?: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
    isOpen,
    onClose,
    userId,
    userName,
    onPostCreated
}) => {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const clearImage = () => {
        setFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('userName', userName);
            formData.append('text', text);

            if (file) {
                formData.append('image', file);
            }

            await axios.post('http://localhost:3010/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            onPostCreated?.();
            onClose();
            setText('');
            clearImage();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="create-post-modal"
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
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                }}
            >
                {/* Header */}
                <Box sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="h6" component="h2">
                        Create New Post
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
                    <Stack spacing={3}>
                        <TextField
                            multiline
                            rows={4}
                            placeholder="What's on your mind?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                sx: { bgcolor: 'background.paper' }
                            }}
                        />

                        {/* Image Preview */}
                        {previewUrl && (
                            <Box sx={{ position: 'relative', width: 'fit-content' }}>
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
                            sx={{ width: 'fit-content' }}
                        >
                            {file ? 'Change Image' : 'Add Image'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                        </Button>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading || !text.trim()}
                            sx={{
                                mt: 2,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark'
                                }
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Create Post'
                            )}
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Modal>
    );
};

export default CreatePostModal; 