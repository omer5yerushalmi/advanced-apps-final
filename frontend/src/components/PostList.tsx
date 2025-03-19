import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    IconButton,
    Box,
    Container,
    Avatar,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    FavoriteBorder,
    ChatBubbleOutline,
} from '@mui/icons-material';
import { Post } from '../types/Post';
import InfiniteScroll from 'react-infinite-scroll-component';

const PostList = forwardRef((props, ref) => {
    const [allPosts, setAllPosts] = useState<Post[]>([]); // Store all posts
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const postsPerPage = 1;

    // Fetch all posts initially
    useEffect(() => {
        fetchAllPosts();
    }, []);

    const fetchAllPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3010/api/posts`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setAllPosts(data);

            // Set initial displayed posts
            const initialPosts = data.slice(0, postsPerPage);
            setDisplayedPosts(initialPosts);
            setHasMore(data.length > postsPerPage);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchMorePosts = () => {
        const nextPosts = allPosts.slice(
            page * postsPerPage,
            (page + 1) * postsPerPage
        );

        if (nextPosts.length === 0) {
            setHasMore(false);
            return;
        }

        setDisplayedPosts(prev => [...prev, ...nextPosts]);
        setPage(page + 1);
    };

    // Add this function to expose the refresh capability
    const refreshPosts = () => {
        setPage(1);
        setDisplayedPosts([]);
        fetchAllPosts();
    };

    // Expose the refresh method
    useImperativeHandle(ref, () => ({
        refreshPosts
    }));

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <InfiniteScroll
                    dataLength={displayedPosts.length}
                    next={fetchMorePosts}
                    hasMore={hasMore}
                    loader={
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <CircularProgress />
                        </Box>
                    }
                    endMessage={
                        <Typography
                            textAlign="center"
                            color="text.secondary"
                            sx={{ my: 2 }}
                        >
                            No more posts to load.
                        </Typography>
                    }
                    style={{ overflow: 'hidden' }}
                >
                    {displayedPosts.map((post, index) => (
                        <React.Fragment key={post.id}>
                            <Card
                                sx={{
                                    minHeight: '100vh',
                                    bgcolor: '#FFFFFF',
                                    boxShadow: 'none',
                                    borderRadius: 0,
                                }}
                            >
                                {/* User Header */}
                                <Box
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderBottom: '1px solid',
                                        borderColor: '#DBDBDB',
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            border: '2px solid #E1306C'
                                        }}
                                    >
                                        {post.userName[0]}
                                    </Avatar>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            ml: 1.5,
                                            fontWeight: 600,
                                            fontSize: '14px'
                                        }}
                                    >
                                        {post.userName}
                                    </Typography>
                                </Box>

                                {/* Post Image */}
                                <CardMedia
                                    component="img"
                                    image={post.imageUrl || '/default.jpg'}
                                    alt="Post image"
                                    sx={{
                                        height: 'calc(100% - 180px)',
                                        objectFit: 'cover',
                                        bgcolor: '#FAFAFA',
                                        filter: !post.imageUrl ? 'brightness(1)' : 'none'
                                    }}
                                />

                                {/* Action Buttons */}
                                <Box sx={{ px: 2, pt: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton sx={{ p: 1, mr: 1 }}>
                                            <FavoriteBorder sx={{ fontSize: 28 }} />
                                        </IconButton>
                                        <IconButton sx={{ p: 1, mr: 1 }}>
                                            <ChatBubbleOutline sx={{ fontSize: 28 }} />
                                        </IconButton>
                                    </Box>

                                    {/* Post Content */}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 1,
                                            fontSize: '14px',
                                            lineHeight: 1.5
                                        }}
                                    >
                                        <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>
                                            {post.userName}
                                        </Box>
                                        {post.text}
                                    </Typography>
                                </Box>
                            </Card>
                            {index < displayedPosts.length - 1 && (
                                <Box
                                    sx={{
                                        height: '12px',
                                        bgcolor: '#FAFAFA',
                                        borderTop: '1px solid',
                                        borderBottom: '1px solid',
                                        borderColor: '#DBDBDB',
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </InfiniteScroll>

                {loading && displayedPosts.length === 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
            </Container>
        </Box>
    );
});

export default PostList; 