import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/App';



// --- App Component (Main Export) ---
function TopNav() {
    const { user, username, isAuthenticated } = useAuth();

    const nextPage = useNavigate();    
      const logout = (event) => {
        //;
      };

      //const goHome = (event) => {
    const goHome = async () => {  
      try {
            //loginUser(user);
            //nextPage(`/StudentList/?${queryParams.toString()}`)
            nextPage(`/Admin`);
        } catch (err) {
            console.log(err);
        } 
        };

        const addItem = async () => {  
      try {
            //loginUser(user);
            //nextPage(`/StudentList/?${queryParams.toString()}`)
            nextPage(`/AdminAddItem`);
        } catch (err) {
            console.log(err);
        } 
        };


        const deleteItem = async () => {  
      try {
            //loginUser(user);
            //nextPage(`/StudentList/?${queryParams.toString()}`)
            nextPage(`/AdminDeleteItem`);
        } catch (err) {
            console.log(err);
        } 
        };

        const editItem = async () => {  
      try {
            //loginUser(user);
            //nextPage(`/StudentList/?${queryParams.toString()}`)
            nextPage(`/AdminEditItem`);
        } catch (err) {
            console.log(err);
        } 
        };
      const userLogout = async () => {  
      try {

            nextPage('/login')

        } catch (err) {
            console.log(err);
        } 
        };
  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton aria-label="logout" onClick={goHome} size="large" sx={{ color: 'white', backgroundColor: 'none', p: 2 }}>
            <HomeIcon fontSize="inherit" />
        </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SELP
          </Typography>

<Button onClick={addItem} sx={{ color: 'white', '&:hover': {backgroundColor: 'text.disabled',}}}>
Add Item</Button>
<Button onClick={deleteItem} sx={{ color: 'white', '&:hover': {backgroundColor: 'text.disabled',}}}>
Delete Item</Button>
<Button onClick={editItem} sx={{ color: 'white', '&:hover': {backgroundColor: 'text.disabled',}}}>
Edit Item</Button>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>
          <Button  sx={{ color: 'white', '&:hover': {backgroundColor: 'text.disabled',}}}>
{username}</Button>
          <IconButton aria-label="logout" size="large" sx={{ color: 'white', backgroundColor: 'none', p: 1 }} onClick={userLogout}>
            <LogoutIcon fontSize="inherit"/>
        </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default TopNav;


