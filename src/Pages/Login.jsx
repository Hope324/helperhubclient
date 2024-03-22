
import React, { useContext, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Context } from '../index';
import toast from 'react-hot-toast';
const SignInForm = () => {
    const {isAuthenticated,setIsAuthenticated,loading,setLoading,user,setUserRole}=useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const handleFormChange = async(e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const [hover,setOnhover]=useState(false);

  const handleLogin = async(e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:4000/api/v1/login', form,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(data);
      toast.success("Logged in successfully...");
      setIsAuthenticated(true);
      setLoading(false);
      if (location.state && location.state.fromSummary) {
        navigate('/summary');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/v1/password/forgot', { email: form.email });
      toast.success("The link to reset your password has been sent to your email. Please check your inbox.");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const hoverEffect=()=>{
    setOnhover(true);
  }
  const discardHoverEffect=()=>{
    setOnhover(false);
  }
  const textStyle={
    fontWeight:'900',
    color:hover?'#f57c00':'#ffa726',
    transition:'all 0.5s ease-in-out'
  }
  if(isAuthenticated) {
    if(user.role === "admin"){
      setUserRole("ADMIN");
    }else{
      setUserRole("USER");
    }
    return <Navigate to={"/"} />
  }
  return (
    <Container component="main" maxWidth="lg" sx={{ width: '80%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7EFE5',
          borderRadius: '2px',
          margin: '1rem',
          padding: '1rem',
        }}
      >
        <Grid container spacing={2}>

          <Grid item xs={8}>
            <img
              src={`/Authentication/Login.jpg`}
              alt="Login Pic"
              style={{ width: '100%', height: '100%', objectFit:'contain', borderRadius: '4px' }}
            />
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ p: 1, width: '100%', height: 'auto', display: 'flex', flexDirection: 'column' }}>
              <Typography component="h1" variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
                Sign In
              </Typography>
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  name="email"
                  required
                  variant="outlined"
                  value={form.email}
                  onChange={handleFormChange}
                  sx={{ marginBottom: 1.5 }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  name="password"
                  required
                  variant="outlined"
                  value={form.password}
                  onChange={handleFormChange}
                  sx={{ marginBottom: 1.5 }}
                />
                <Button type="submit" disabled={loading} fullWidth variant="contained" color="primary" sx={{ marginBottom: 1.5 }}>
                  Sign In
                </Button>
                <Typography variant="h6" align="center" margin={1}>
                 
                    <Button onClick={handleForgotPassword}>Forgot Your Password?</Button>

                </Typography>
              </form>
              <Typography variant="body2" align="center" margin={1}>
                Don't have an account?{' '}
                <Link to={'/register'} style={textStyle} onMouseOver={hoverEffect} onMouseOut={discardHoverEffect}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignInForm;