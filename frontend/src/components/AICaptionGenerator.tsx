import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface Props {
    onSelectCaption: (caption: string) => void;
}

const AICaptionGenerator: React.FC<Props> = ({ onSelectCaption }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateCaption = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:3010/api/ai/generate-caption', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Failed to generate caption');
            }

            const data = await response.json();
            onSelectCaption(data.caption);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate caption');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                AI Caption Generator
            </Typography>
            <TextField
                fullWidth
                placeholder="Describe your photo (e.g., 'sunset at the beach')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                sx={{ mb: 1 }}
            />
            <Button
                variant="contained"
                onClick={generateCaption}
                disabled={!prompt || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
            >
                Generate Caption
            </Button>
            {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default AICaptionGenerator; 