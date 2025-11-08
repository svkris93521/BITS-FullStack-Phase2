// src/components/Login.jsx
import { useEffect, useState } from 'react'
import React, { createContext, useContext } from 'react';


import './App.css'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/App'; 


function Login() {

  const [username, setUserName] = useState('');
  const [pwd, setPassword] = useState('');
  const [error, setError] = useState('');
  const nextPage = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !pwd) {
      alert('Please enter both username and password.');
      return;
    }

    const base64Encode = (str) => {
    const utf8 = new TextEncoder().encode(str);
    return btoa(String.fromCharCode.apply(null, utf8));
    };

    const authUser = async () => {  
      try {
        const credentials = username+':'+pwd;
        const encodedCredentials = base64Encode(`${username}:${pwd}`);
        const response = await fetch("http://127.0.0.1:8000/selp/users/login/", {
            method: "POST",
            headers: {
                    'Authorization': `Basic ${encodedCredentials}`,
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

  const data = await response.json();
        console.log(data);
        const userRole = data?.user_type?.toLowerCase()
        const userID = data?.perms.id
        const uname = data?.perms.username
  loginUser(userID, uname, userRole)
        console.log("user ID="+ userID)


        switch (userRole) {
          case 'admin':
              nextPage('/admin')
              break;
          case 'staff':
              nextPage('/staff')
              break;  
          case 'student':
              nextPage('/student')
              break;
          default:
        }

        } catch (err) {
            console.log(err);
        } 
    };

    authUser(username, pwd);

  };

  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/SELP-banner.png"
        title="SELP banner"
      />
      <CardContent>
        <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
        <Box
          sx={{
          display: 'flex',
          flexDirection: 'column',
          '& .MuiTextField-root': { width: '40ch' },
          }}
        >
          <Box sx={{ width: 500, maxWidth: '100%' }}><TextField fullWidth label={'username'} id="username" margin="normal" onChange={(e) => setUserName(e.target.value)}/> </Box>
          <Box sx={{ width: 500, maxWidth: '100%' }}><TextField fullWidth label={'password'} id="password" margin="normal" onChange={(e) => setPassword(e.target.value)}/> </Box>
          <Button style={{ width: '300px', height: '30px', marginLeft:'90px', marginTop: '20px' }}
              type="submit"
              variant="contained"
              size="small"
              onClick={handleSubmit}
            >
              Sign in
          </Button>



            <Link
              component="button"
              type="button"
              variant="body2"
              sx={{ alignSelf: 'center'}}
            >
              Forgot your password?
            </Link>
            <p/>
            <Typography
            >
            Sample users (user / password):
            <p/><b>Admin</b>: admin / 123   
            <b> &nbsp;&nbsp;Staff</b>: staff / 123  
            <b> &nbsp;&nbsp;Student</b>: student / 123
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Login;