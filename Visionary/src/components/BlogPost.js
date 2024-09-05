""
import { useState } from 'react';
import { Button, TextField, IconButton } from '@mui/material';
import { Comment as CommentIcon } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const GET_BLOG_POST = gql`
  query GetBlogPost($id: String!) {
    blogPost(id: $id) {
      id
      title
      content
      comments {
        id
        content
        createdAt
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($blogPostId: String!, $content: String!) {
    addComment(blogPostId: $blogPostId, content: $content) {
      id
      content
      createdAt
    }
  }
`;

const BlogPost = ({ id }) => {
  const { data, loading, error } = useQuery(GET_BLOG_POST, { variables: { id } });
  const [addComment] = useMutation(ADD_COMMENT);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleAddComment = async () => {
    await addComment({ variables: { blogPostId: id, content: newComment } });
    setNewComment('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{data.blogPost.title}</h1>
      <p className="mt-2">{data.blogPost.content}</p>
      
      <div className="mt-4">
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          className="mt-2"
        >
          Add Comment
        </Button>
      </div>
      
      <div className="mt-4">
        <IconButton
          onClick={() => setShowComments(!showComments)}
          color="primary"
        >
          <CommentIcon />
        </IconButton>
        {showComments && (
          <div className="mt-2">
            {data.blogPost.comments.map((comment) => (
              <div key={comment.id} className="p-2 border-b">
                <p>{comment.content}</p>
                <p className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
