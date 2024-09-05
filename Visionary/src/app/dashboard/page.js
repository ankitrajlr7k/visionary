"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button, TextField, Container, Typography, Grid,
  Card, CardMedia, CardContent, IconButton, Box, Select, MenuItem,
  CircularProgress
} from '@mui/material';
import { useSession } from 'next-auth/react';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import ChatIcon from '@mui/icons-material/Chat';
import { marked } from 'marked';
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [chatResponse, setChatResponse] = useState(null);
  const [history, setHistory] = useState({ images: [], chats: [] });
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('image');
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
    } else {
      fetchHistory();
    }
  }, [session, status, router]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('/api/history', {
        method: 'GET',
        headers: { 'user-id': session.user.id },
      });
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory({ images: data.images || [], chats: data.chats || [] });
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGenerateImage = async () => {
    setLoadingContent(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': session.user.id,
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to generate image');
      const data = await response.json();
      setImageUrl(data.imageUrl);
      
      fetchHistory();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleChat = async () => {
    setLoadingContent(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': session.user.id, // Include user ID in the headers if needed by your API
        },
        body: JSON.stringify({ prompt: text }), // Send the prompt to the API
      });
  
      // Check if the response is okay
      if (!response.ok) throw new Error('Failed to get chat response');
      
      // Parse the response JSON
      const data = await response.json();
      
      // Check if the response contains text
      if (data.text) {
        console.log(data)
        setChatResponse(data);
      } else {
        console.error('Unexpected API response structure:', data);
        setChatResponse('No response text available');
      }
      
      // Optionally, update history or other UI elements here
      fetchHistory(); 
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setChatResponse('Error fetching chat response');
    } finally {
      setLoadingContent(false);
    }
  };

  const handlePostImage = async (url) => {
    try {
      const response = await fetch('/api/post-image', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': session.user.id,
        },
        body: JSON.stringify({ imageUrl: url, userId: session.user.id }),
      });

      if (!response.ok) throw new Error('Failed to post image');
      
      fetchHistory();
    } catch (error) {
      console.error('Error posting image:', error);
    }
  };
  const handlePostchat=async (chatId)=>{
    try {
        const response = await fetch('/api/blog-post', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'user-id': session.user.id,
          },
          body: JSON.stringify({ chatId: chatId, userId: session.user.id }),
        });
  
        if (!response.ok) throw new Error('Failed to post blog');
        
        fetchHistory();
      } catch (error) {
        console.error('Error posting image:', error);
      }
  }

  const handleDownloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (type, id) => {
    try {
      const response = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': session.user.id,
        },
        body: JSON.stringify({ id, type }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }
  
      fetchHistory();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const filteredImages = history.images.filter(image => 
    image.prompt?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredChats = history.chats.filter(chat =>
    chat.prompt?.toLowerCase().includes(search.toLowerCase())
  );
  const renderHTML = (html) => {
    return { __html: html };
  };
  const handleModeChange = (event) => {
    setMode(event.target.value);
    setText('');
    setImageUrl('');
    setChatResponse('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          width: '100%', // Full width of the parent
          height:'100%',
          minHeight:'100vh',
          minWidth: '85vw', // Fixed max width
          bgcolor: '#ffffff',
          position: 'relative', // For positioning the dropdown
          p: 0,
          m: 0,
        }}
      >
        <Select
          value={mode}
          onChange={handleModeChange}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: '#eeeeee',
            borderRadius: 2,
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <MenuItem value="image">
            <ImageIcon />
            Generate Image
          </MenuItem>
          <MenuItem value="chat">
            <ChatIcon />
            Chat
          </MenuItem>
        </Select>

        <Typography variant="h4" gutterBottom color="#333" align="center" sx={{ mt: 6 }}>
        Visionary
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="#333">
              {mode === 'image' ? 'Generate Image' : 'Chat'}
            </Typography>
            <TextField
              label="Prompt"
              variant="outlined"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ bgcolor: '#ffffff', borderRadius: 1, input: { color: '#333' } }}
              InputLabelProps={{
                style: { color: '#333' },
              }}
            />
            <Button 
              onClick={mode === 'image' ? handleGenerateImage : handleChat} 
              variant="contained" 
              sx={{ mt: 2, bgcolor: mode === 'image' ? '#007bff' : '#28a745', '&:hover': { bgcolor: mode === 'image' ? '#0056b3' : '#218838' } }}
            >
              {mode === 'image' ? 'Generate Image' : 'Get Chat Response'}
            </Button>
            {loadingContent && (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
              </Box>
            )}
            {mode === 'image' && imageUrl && (
              <Box mt={2} justifyContent="center">
                <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }} />
                <Button 
                  onClick={() => handleDownloadImage(imageUrl)} 
                  variant="contained" 
                  sx={{ mt: 1, bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' } }}
                >
                  <DownloadIcon />
                  Download Image
                </Button>
                <IconButton onClick={() => handlePostImage(imageUrl)} sx={{ color: '#28a745' }}>
                  <ChatIcon /> Post
                </IconButton>
              </Box>
            )}
            {mode === 'chat' && chatResponse && (
                <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="body1" color="#333" sx={{ mt: 2, p: 2, bgcolor: '#f0f0f0', borderRadius: 1 }}>
               {chatResponse.text && <div dangerouslySetInnerHTML={renderHTML(marked(chatResponse.text))} />}

              </Typography>
               
               <IconButton onClick={() => handlePostchat(chatResponse.id)} sx={{ color: '#28a745' }}>
               <ChatIcon />
               </IconButton>
               </Box>
             )}
             
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="#333">
              History
            </Typography>
            <TextField
              label="Search History"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ bgcolor: '#ffffff', borderRadius: 1, mb: 2, input: { color: '#333' } }}
              InputLabelProps={{
                style: { color: '#333' },
              }}
            />
            <Box
              sx={{
                height: '70vh',
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: 2,
                bgcolor: '#ffffff',
                p: 2,
              }}
            >
              {loadingHistory ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {mode === 'image' && filteredImages.map((image) => (
                    <Card key={image.id} sx={{ mb: 2 }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={image.url}
                        alt={image.prompt}
                      />
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">
                          {image.prompt}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mt={1}>
                          <IconButton onClick={() => handleDownloadImage(image.url)}>
                            <DownloadIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete('image', image.id)}>
                            <DeleteIcon />
                          </IconButton>
                          {!image.isPublic && (
                            <IconButton onClick={() => handlePostImage(image.url)} sx={{ color: '#28a745' }}>
                              <ChatIcon />
                            </IconButton>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  {mode === 'chat' && filteredChats.map((chat) => (
                    <Card key={chat.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography component="div" variant="h6" color="#333">
                          
                          {chat.prompt.length > 30? `${chat.prompt.substring(0, 30)}...` : chat.prompt}
                        </Typography>
                        <Typography variant="body2" color="#333">
                          
                          <div dangerouslySetInnerHTML={renderHTML(marked(chat.response))} />
                        </Typography>
                        
        
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pb: 1 }}>
                        <IconButton onClick={() => handleDelete('chat', chat.id)} sx={{ color: '#ff5722' }}>
                          <DeleteIcon />
                        </IconButton>
                        {!chat.blogPostupdated && (
                        <IconButton 
                            onClick={() => handlePostchat(chat.id)} 
                            sx={{ color: '#28a745' }}
                        >
                            <ChatIcon /> Post
                        </IconButton>
                        
                        )}
{console.log(chat)}
                      </Box>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
