import React, { useState, useEffect } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    IconButton,
    Box,
    Container,
    Avatar,
} from '@mui/material';
import {
    FavoriteBorder,
    ChatBubbleOutline,
} from '@mui/icons-material';
import { Post } from '../types/Post';
import { mockPosts } from '../mockData/postData';
import InfiniteScroll from 'react-infinite-scroll-component';

const PostList = () => {
    // New state variables for pagination
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const postsPerPage = 1;

    // Initialize first page
    useEffect(() => {
        const initialPosts = mockPosts.slice(0, postsPerPage);
        setDisplayedPosts(initialPosts);
        setHasMore(mockPosts.length > postsPerPage);
    }, []);

    // Function to load more posts
    const fetchMorePosts = () => {
        const nextPosts = mockPosts.slice(
            page * postsPerPage,
            (page + 1) * postsPerPage
        );

        if (nextPosts.length === 0) {
            setHasMore(false);
            return;
        }

        setDisplayedPosts([...displayedPosts, ...nextPosts]);
        setPage(page + 1);
    };

    return (
        <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <InfiniteScroll
                    dataLength={displayedPosts.length}
                    next={fetchMorePosts}
                    hasMore={hasMore}
                    loader={<Box sx={{ height: '100vh' }} />}
                    endMessage={<Box sx={{ height: '100vh' }} />}
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
            </Container>
        </Box>
    );
};

export default PostList; 