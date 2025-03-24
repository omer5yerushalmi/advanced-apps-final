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
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { Post } from '../types/Post';
import InfiniteScroll from 'react-infinite-scroll-component';
import EditPostModal from './EditPostModal';
import { API_CONFIG } from '../config/api';
import CommentModal from './CommentModal';

const PostList = forwardRef((props, ref) => {
    const [allPosts, setAllPosts] = useState<Post[]>([]); // Store all posts
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'my'>('all');
    const postsPerPage = 1;
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    // Fetch all posts initially
    useEffect(() => {
        fetchAllPosts();
    }, []);

    const filterPosts = (posts: Post[]) => {
        const userEmail = localStorage.getItem('userEmail');
        if (activeFilter === 'my') {
            return posts.filter(post => post.userId === userEmail);
        }
        return posts;
    };

    const fetchAllPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_CONFIG.baseURL}/api/posts`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setAllPosts(data);

            // Apply filter before setting displayed posts
            const filteredData = filterPosts(data);
            const initialPosts = filteredData.slice(0, postsPerPage);
            setDisplayedPosts(initialPosts);
            setHasMore(filteredData.length > postsPerPage);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchMorePosts = () => {
        const filteredPosts = filterPosts(allPosts);
        const nextPosts = filteredPosts.slice(
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

    // Add effect to handle filter changes
    useEffect(() => {
        setPage(1);
        setDisplayedPosts([]);
        const filteredPosts = filterPosts(allPosts);
        const initialPosts = filteredPosts.slice(0, postsPerPage);
        setDisplayedPosts(initialPosts);
        setHasMore(filteredPosts.length > postsPerPage);
    }, [activeFilter]);

    // Add this function to expose the refresh capability
    const refreshPosts = () => {
        setPage(1);
        setDisplayedPosts([]);
        fetchAllPosts();
    };

    const handleDeletePost = async (postId: string) => {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            // Remove the deleted post from both states
            setAllPosts(prev => prev.filter(post => post._id !== postId));
            setDisplayedPosts(prev => prev.filter(post => post._id !== postId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleEditPost = (post: Post) => {
        setEditingPost(post);
        setIsEditModalOpen(true);
    };

    const handleEditComplete = async (postId: string, newText: string, file?: File) => {
        try {
            const formData = new FormData();
            formData.append('text', newText);
            if (file) {
                formData.append('image', file);
            }

            const response = await fetch(`${API_CONFIG.baseURL}/api/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            const updatedPost = await response.json();

            // Update the posts in state
            setAllPosts(prev => prev.map(p => p._id === postId ? updatedPost : p));
            setDisplayedPosts(prev => prev.map(p => p._id === postId ? updatedPost : p));

            setIsEditModalOpen(false);
            setEditingPost(null);
        } catch (err) {
            console.error('Error updating post:', err);
            // Handle error appropriately
        }
    };

    const handleLikePost = async (postId: string) => {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: localStorage.getItem('userEmail')
                })
            });

            if (!response.ok) {
                throw new Error('Failed to like/unlike post');
            }

            const updatedPost = await response.json();

            // Update both post lists with the new like status
            setAllPosts(prev => prev.map(p => p._id === postId ? updatedPost : p));
            setDisplayedPosts(prev => prev.map(p => p._id === postId ? updatedPost : p));

            // Toggle the liked status in our local state
            setLikedPosts(prev => {
                const newSet = new Set(prev);
                if (newSet.has(postId)) {
                    newSet.delete(postId);
                } else {
                    newSet.add(postId);
                }
                return newSet;
            });
        } catch (err) {
            console.error('Error liking post:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    // Add this effect to initialize liked posts when posts are loaded
    useEffect(() => {
        // Initialize likedPosts based on the user's email in the likes array of each post
        const userEmail = localStorage.getItem('userEmail');
        const userLikedPosts = new Set(
            allPosts
                .filter(post => post.likes?.includes(userEmail || ''))
                .map(post => post._id)
        );
        setLikedPosts(userLikedPosts);
    }, [allPosts]);

    // Expose the refresh method
    useImperativeHandle(ref, () => ({
        refreshPosts
    }));

    const handleCommentCountUpdate = (postId: string, count: number) => {
        setAllPosts(prev => prev.map(p =>
            p._id === postId ? { ...p, commentsCount: count } : p
        ));
        setDisplayedPosts(prev => prev.map(p =>
            p._id === postId ? { ...p, commentsCount: count } : p
        ));
    };

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
                {/* Add Navigation Filter */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        pt: 2,
                        pb: 2,
                        borderBottom: 1,
                        borderColor: 'divider'
                    }}
                >
                    <Typography
                        onClick={() => setActiveFilter('all')}
                        sx={{
                            cursor: 'pointer',
                            fontWeight: activeFilter === 'all' ? 'bold' : 'normal',
                            color: activeFilter === 'all' ? 'primary.main' : 'text.primary',
                            borderBottom: activeFilter === 'all' ? 2 : 0,
                            borderColor: 'primary.main',
                            pb: 0.5
                        }}
                    >
                        All Posts
                    </Typography>
                    <Typography
                        onClick={() => setActiveFilter('my')}
                        sx={{
                            cursor: 'pointer',
                            fontWeight: activeFilter === 'my' ? 'bold' : 'normal',
                            color: activeFilter === 'my' ? 'primary.main' : 'text.primary',
                            borderBottom: activeFilter === 'my' ? 2 : 0,
                            borderColor: 'primary.main',
                            pb: 0.5
                        }}
                    >
                        My Posts
                    </Typography>
                </Box>

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
                        <React.Fragment key={post._id}>
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
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        px: 2,
                                        py: 1.5
                                    }}
                                >
                                    {/* User info group on the left */}
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                border: '2px solid #E1306C'
                                            }}
                                        >
                                            {post.userName}
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

                                    {/* Edit and Delete buttons group on the right */}
                                    {post.userId === localStorage.getItem('userEmail') && (
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton
                                                onClick={() => handleEditPost(post)}
                                                size="small"
                                                sx={{
                                                    color: 'grey.500',
                                                    '&:hover': {
                                                        color: 'primary.main'
                                                    }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDeletePost(post._id)}
                                                size="small"
                                                sx={{
                                                    color: 'grey.500',
                                                    '&:hover': {
                                                        color: 'error.main'
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
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
                                        <IconButton
                                            onClick={() => handleLikePost(post._id)}
                                            sx={{
                                                p: 1,
                                                mr: 1,
                                                color: likedPosts.has(post._id) ? 'error.main' : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                }
                                            }}
                                        >
                                            <FavoriteBorder sx={{ fontSize: 24 }} />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                setSelectedPostId(post._id);
                                                setCommentModalOpen(true);
                                            }}
                                            sx={{
                                                p: 1,
                                                mr: 1,
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                }
                                            }}
                                        >
                                            <ChatBubbleOutline sx={{ fontSize: 24 }} />
                                        </IconButton>
                                    </Box>

                                    {/* Likes count */}
                                    <Box sx={{ px: 1, pb: 1 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '14px',
                                            }}
                                        >
                                            {post.likesCount || 0} {post.likesCount === 1 ? 'like' : 'likes'} • {post.commentsCount || 0} {post.commentsCount === 1 ? 'comment' : 'comments'}
                                        </Typography>
                                    </Box>

                                    {/* Post Content */}
                                    <Box sx={{ px: 1, pb: 2 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: '14px',
                                                lineHeight: 1.5,
                                                display: 'flex',
                                                gap: '4px'
                                            }}
                                        >
                                            <Box component="span" sx={{
                                                fontWeight: 600,
                                                '&:hover': {
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                }
                                            }}>
                                                {post.userName}
                                            </Box>
                                            {post.text}
                                        </Typography>
                                    </Box>
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
            <EditPostModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingPost(null);
                }}
                post={editingPost}
                onEditComplete={handleEditComplete}
            />
            {selectedPostId && (
                <CommentModal
                    open={commentModalOpen}
                    onClose={() => setCommentModalOpen(false)}
                    postId={selectedPostId}
                    onCommentCountUpdate={handleCommentCountUpdate}
                />
            )}
        </Box>
    );
});

export default PostList; 