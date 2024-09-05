// components/BlogList.jsx
"use client";
import { useState, useEffect } from 'react';
import { Button, Typography, Box, List, ListItem, Card, CardContent, CardActions, IconButton, Divider, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { marked } from 'marked';
import { styled } from '@mui/material/styles';
import { useSession } from 'next-auth/react';

// Styled components
const CardStyled = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  margin: 'auto',
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[8],
  },
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    maxWidth: '700px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
}));

const ContentPreview = styled('div')(({ theme }) => ({
  height: '200px',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'justify',
  boxSizing: 'border-box',
  color: theme.palette.text.primary,
}));

const GradientOverlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  background: `linear-gradient(to top, ${theme.palette.background.default}, transparent)`,
}));

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0),
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.2rem',
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

const MetaText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const LoadingContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const BlogList = ({ title, page, setPage, totalPages }) => {
  const { data: session } = useSession();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const postsPerPage = 10;

  const fetchBlogPosts = async (searchTitle = '', pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/blog', {
        params: {
          title: searchTitle,
          _limit: postsPerPage,
          _page: pageNumber,
        },
      });

      const totalPosts = parseInt(response.headers['x-total-count'], 10);
      setTotalPages(Math.ceil(totalPosts / postsPerPage));

      setBlogPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts(title, page);
  }, [title, page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/blog/${postId}/delete`);
      fetchBlogPosts(title, page);
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  return (
    <Box>
      {blogPosts.length > 0 && (
        <>
          <List
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            {blogPosts.map((post) => (
              <ListItemStyled key={post.id} disableGutters>
                <CardStyled>
                  <CardContent>
                    <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems="center">
                      <TitleText>
                        {post.title}
                      </TitleText>
                      {session && session.user && session.user.id === post.userId && (
                        <IconButton color="secondary" onClick={() => handleDelete(post.id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                    <MetaText>
                      By: {post.user.email} {post.user.name && `(${post.user.name})`}
                    </MetaText>
                    <MetaText>
                      Created on: {new Date(post.createdAt).toLocaleDateString()}
                    </MetaText>
                    <MetaText>
                      Comments: {post.commentsCount}
                    </MetaText>
                    <ContentPreview>
                      <div dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
                      <GradientOverlay />
                    </ContentPreview>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button variant="outlined" color="primary" href={`/blog/${post.id}`}>
                      View Post
                    </Button>
                  </CardActions>
                </CardStyled>
              </ListItemStyled>
            ))}
          </List>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default BlogList;
