"use client";
import { useState, useEffect, useCallback } from 'react';
import { Button, Typography, TextField, Box, List, ListItem, IconButton, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { marked } from 'marked';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BlogPage({ params }) {
  const { id } = params;
  const [blogPost, setBlogPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editPost, setEditPost] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editComments, setEditComments] = useState({});
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [error, setError] = useState(null);
  const { data: session, status } = useSession(); // Use useSession hook

  const fetchBlogPost = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const blogPostResponse = await axios.get(`/api/blog/${id}`);
      const commentsResponse = await axios.get(`/api/blog/${id}/comments`);

      if (blogPostResponse.data) {
        setBlogPost(blogPostResponse.data);
        setComments(commentsResponse.data);
        setEditedContent(blogPostResponse.data.content); // Initialize with current content
      } else {
        setBlogPost(null); // Set blogPost to null if no post is found
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load blog post and comments.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlogPost();
  }, [fetchBlogPost]);

  const handleToggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    if (status !== 'authenticated') {
      alert('You must be logged in to add a comment.');
      return;
    }

    try {
      const userId = session?.user?.id || 'dummy-user-id'; // Get user ID from session
      const response = await axios.post(`/api/blog/${id}/comments/add`, {
        content: newComment,
        userId,
      });

      setComments((prevComments) => [response.data, ...prevComments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment.');
    }
  };

  const handleRefreshComments = async () => {
    try {
      const commentsResponse = await axios.get(`/api/blog/${id}/comments`);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error('Error refreshing comments:', error);
      setError('Failed to refresh comments.');
    }
  };

  const handleEditPost = () => {
    setEditPost(true);
  };

  const handleSavePost = async () => {
    try {
      await axios.put(`/api/blog/${id}/update`, { content: editedContent });
      setBlogPost((prevPost) => ({ ...prevPost, content: editedContent }));
      setEditPost(false);
    } catch (error) {
      console.error('Error updating blog post:', error);
      setError('Failed to update blog post.');
    }
  };

  const handleCancelEditPost = () => {
    setEditPost(false);
    setEditedContent(blogPost.content); // Revert changes
  };

  const handleEditComment = (commentId, content) => {
    setEditComments((prev) => ({ ...prev, [commentId]: content }));
  };

  const handleSaveComment = async (commentId) => {
    try {
      await axios.put(`/api/blog/${id}/comments/${commentId}/update`, { content: editComments[commentId] });
      setComments((prev) => prev.map((comment) =>
        comment.id === commentId ? { ...comment, content: editComments[commentId] } : comment
      ));
      setEditComments((prev) => ({ ...prev, [commentId]: undefined }));
    } catch (error) {
      console.error('Error updating comment:', error);
      setError('Failed to update comment.');
    }
  };

  const handleCancelEditComment = (commentId) => {
    setEditComments((prev) => ({ ...prev, [commentId]: undefined }));
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/blog/${id}/comments/${commentId}/delete`);
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment.');
    }
  };

  const renderHTML = (html) => {
    return { __html: html };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" width='100vw'>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!blogPost) {
    return <Typography>No blog post found.</Typography>;
  }

  return (
    <Box className="p-4">
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {blogPost.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {editPost ? (
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={10}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            ) : (
              <div dangerouslySetInnerHTML={renderHTML(marked(blogPost.content))} />
            )}
          </Typography>
          
          {session?.user?.id === blogPost.userId && (
            <Box display="flex" gap={1}>
              {editPost ? (
                <>
                  <IconButton color="primary" onClick={handleSavePost}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={handleCancelEditPost}>
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton color="primary" onClick={handleEditPost}>
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          )}

          <Button variant="contained" color="primary" onClick={handleToggleComments} className="mt-2">
            {commentsVisible ? 'Hide Comments' : 'Show Comments'}
          </Button>
          
          <Button variant="outlined" color="secondary" onClick={handleRefreshComments} className="mt-2">
            Refresh Comments
          </Button>

          {commentsVisible && (
            <>
              <List>
                {comments.map((comment) => (
                  <ListItem key={comment.id}>
                    <Box className="border p-2 mb-2 w-full">
                      {editComments[comment.id] !== undefined ? (
                        <>
                          <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={editComments[comment.id]}
                            onChange={(e) => handleEditComment(comment.id, e.target.value)}
                          />
                          <Box display="flex" gap={1} mt={1}>
                            <IconButton color="primary" onClick={() => handleSaveComment(comment.id)}>
                              <SaveIcon />
                            </IconButton>
                            <IconButton color="secondary" onClick={() => handleCancelEditComment(comment.id)}>
                              <CancelIcon />
                            </IconButton>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" color="textSecondary">
                            {comment.content}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {comment.userEmail} - {new Date(comment.createdAt).toLocaleDateString()}
                          </Typography>
                          {session?.user?.id === comment.userId && (
                            <Box display="flex" gap={1} mt={1}>
                              <IconButton color="primary" onClick={() => handleEditComment(comment.id, comment.content)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton color="secondary" onClick={() => handleDeleteComment(comment.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          )}
                        </>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
              {status === 'authenticated' ? (
                <Box className="mt-4">
                  <TextField
                    label="Add a comment"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button variant="contained" color="primary" onClick={handleAddComment} className="mt-2">
                    Add Comment
                  </Button>
                </Box>
              ) : (
                <Typography color="textSecondary" className="mt-2">
                  Log in to add comments.
                </Typography>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
