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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';
import {
    Close as CloseIcon,
    Image as ImageIcon,
    Delete as DeleteIcon,
    AutoAwesome as AutoAwesomeIcon,
    AddPhotoAlternate,
    Close,
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
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [promptText, setPromptText] = useState('');

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

    const generateAICaption = async () => {
        try {
            setAiLoading(true);
            setAiError(null);

            // Get context from either the prompt input or the image
            let context = promptText;
            if (file) {
                context += ` with an image named: ${file.name}`;
            }

            if (!context.trim()) {
                throw new Error('Please provide some context for the caption');
            }

            const response = await fetch('http://localhost:3010/api/ai/generate-caption', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ prompt: context })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate caption');
            }

            const data = await response.json();
            setText(data.caption);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : 'Failed to generate caption');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    {/* Main caption input */}
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What's on your mind?"
                        sx={{ mb: 2 }}
                    />

                    {/* File upload section */}
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<AddPhotoAlternate />}
                        sx={{ mb: 2 }}
                    >
                        ADD IMAGE
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </Button>

                    {/* Image preview */}
                    {previewUrl && (
                        <Box sx={{ position: 'relative', mb: 2 }}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '200px' }}
                            />
                            <IconButton
                                onClick={clearImage}
                                sx={{ position: 'absolute', top: 0, right: 0 }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    )}

                    {/* AI Caption Generator section */}
                    <Box sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            AI Caption Generator
                        </Typography>

                        <TextField
                            fullWidth
                            size="small"
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            placeholder="Describe what you want to post about..."
                            sx={{ mb: 1 }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                                onClick={generateAICaption}
                                disabled={aiLoading || !promptText.trim()}
                                startIcon={aiLoading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                                variant="contained"
                                size="small"
                            >
                                Generate Caption
                            </Button>
                        </Box>

                        {aiError && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                                {aiError}
                            </Alert>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>CANCEL</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isLoading || !text}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'POST'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreatePostModal; 