import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';

import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '/src/App';



function TopNav() {
  const { user, username, isAuthenticated } = useAuth();

    const nextPage = useNavigate();    
      const logout = (event) => {
        //;
      };

      const goHome = (event) => {
        //;
      };

      const userLogout = async () => {  
      try {
            nextPage('/login')
        } catch (err) {
            console.log(err);
        } 
        };

      const userAddRequest = async () => {  
      try {
            //loginUser(user);
            //nextPage(`/StudentList/?${queryParams.toString()}`)
            nextPage(`/StudentList`);
        } catch (err) {
            console.log(err);
        } 
        };

        const userList = async () => {  
      try {
            //loginUser(user);
            //nextPage(`/StudentList/?${queryParams.toString()}`)
            nextPage(`/Student`);
        } catch (err) {
            console.log(err);
        } 
        };
  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton aria-label="logout" onClick={userList} size="large" sx={{ color: 'white', backgroundColor: 'none', p: 2 }}>
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
            SELP - Student 
          </Typography>

<Button onClick={userAddRequest} sx={{ color: 'white', '&:hover': {backgroundColor: 'text.disabled',}}}>
Request Item</Button>

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


