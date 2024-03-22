import { Avatar, Button, CssBaseline, Paper, TextField, Typography } from '@mui/material';
import { Container } from '@mui/system';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


import React, { useContext, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import { Context } from '../index';
import axios from 'axios'
import toast from 'react-hot-toast';
const ResetPassword = () => {
  const {token}=useParams();
  const [newPassword,setNewPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const {isAuthenticated,setIsAuthenticated,loading,setLoading}=useContext(Context);
  const handleResetPassword=async(e)=>{
  

    console.log(token);
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`http://localhost:4000/api/v1/password/reset/${token}`,
      {
        newPassword,
        confirmPassword
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(data);
      toast.success("You have registered successfully...");
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
      setIsAuthenticated(false);
      setLoading(false);

    }
}
 if(isAuthenticated) return <Navigate to={"/"} />
  
  return (
    <Container component="main" maxWidth="xs">
    <CssBaseline />
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)', 
      }}
    >
      <Avatar
        sx={{
          margin: 1,
          backgroundColor:"black", 
        }}
      >
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Set your password
      </Typography>
      <form
        sx={{
          width: '100%',
          marginTop: 3,
        }}
        onSubmit={handleResetPassword}
      >
        
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="New Password"
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Confirm Password"
          type="password"
          name="confirmPassword"
            value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button
          fullWidth
          variant="contained"
          color="warning"
          sx={{
            marginY: 3,
            backgroundColor: "black", 
            transition:'all 0.5s ease-in-out'
          }}
          type='submit'
          disabled={loading}
        >
          Submit
        </Button>
        
      </form>
     
    </Paper>
  </Container>
  )
}

export default ResetPassword