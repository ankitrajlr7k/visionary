"use client";
import Link from 'next/link';
import { List, ListItemButton, ListItemText, Divider, Drawer, Typography, Box } from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation'; // Use useRouter to get the current route

const drawerWidth = 240;

const Sidebar = ({ open, handleDrawerToggle }) => {
  const { data: session } = useSession();
  const route = usePathname(); // Get the current route
  console.log(route);
  // Function to determine if the link is active
  const isActive = (path) => route === path;

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'white', // Set background color to white
          color: 'black',   // Set text color to black for contrast
        },
      }}
      variant="persistent"
      anchor="left"
      open
    >
      <Box sx={{ p: 2, bgcolor: '#63526c', color: 'white' }}>
        <Typography variant="h6" noWrap>
          Visionary
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'gray' }} />
      <List>
        {!session ? (
          <>
            <ListItemButton
              component={Link}
              href="/"
              sx={{
                bgcolor: isActive('/') ? '#4e4f84' : 'transparent',
                '&:hover': { bgcolor: '#cfcfcf' },
              }}
            >
              <ListItemText primary="Gallery" sx={{ color: isActive('/') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              href="/blog"
              sx={{
                bgcolor: isActive('/blog') ? '#4e4f84' : 'transparent',
                '&:hover': { bgcolor: '#cfcfcf' },
              }}
            >
              <ListItemText primary="BlogPosts" sx={{ color: isActive('/blog') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              href="/login"
              sx={{
                bgcolor: isActive('/login') ? '#4e4f84' : 'transparent',
                '&:hover': { bgcolor: '#cfcfcf' },
              }}
            >
              <ListItemText primary="Login" sx={{ color: isActive('/login') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              href="/signup"
              sx={{
                bgcolor: isActive('/signup') ? '#4e4f84' : 'transparent',
                '&:hover': { bgcolor: '#cfcfcf' },
              }}
            >
              <ListItemText primary="Sign Up" sx={{ color: isActive('/signup') ? 'white' : 'black' }} />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton
              component={Link}
              href="/dashboard"
              sx={{
                bgcolor: isActive('/dashboard') ? '#4e4f84' : 'transparent',
                '&:hover': { bgcolor: '#cfcfcf' },
              }}
            >
              <ListItemText primary="Use AI" sx={{ color: isActive('/dashboard') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              href="/"
              sx={{
                bgcolor: isActive('/') ? '#4e4f84' : 'transparent',
                '&:hover': { bgcolor: '#cfcfcf' },
              }}
            >
              <ListItemText primary="Gallery" sx={{ color: isActive('/') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              href="/blog"
              sx={{
                bgcolor: isActive('/blog') ? '#4e4f84' : 'transparent',
                '&:hover': { bgcolor: '#cfcfcf' },
              }}
            >
              <ListItemText primary="BlogPosts" sx={{ color: isActive('/blog') ? 'white' : 'black' }} />
            </ListItemButton>
            <ListItemButton
              onClick={() => signOut()}
              sx={{
                bgcolor: 'transparent',
                '&:hover': { bgcolor: '#ff9f9f ' },
              }}
            >
              <ListItemText primary="Logout" sx={{ color: 'black' }} />
            </ListItemButton>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;