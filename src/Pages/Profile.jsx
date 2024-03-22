
import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Grid, Box, Container as MuiContainer } from '@mui/material';
import { Context } from '../index';
import Loader from '../Components/Loader';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { clearPaymentInfo, setPaymentInfo } from '../Redux/paymentReducer';
import { Stack } from '@mui/system';

function Profile() {
  const { isAuthenticated, loading } = useContext(Context);
  const dispatch = useDispatch();
  const { cardName, cardNumber, expiryDate, cvv } = useSelector((state) => state.paymentReducer);

  const [basicInfo, setBasicInfo] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    dob: '',
    gender: ''
  });

  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [paymentInfo, setPaymentInfoLocal] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/userDetails', { withCredentials: true });
      const { username, email, mobileNumber, dob, gender } = response.data.user;
      setBasicInfo({ username, email, mobileNumber, dob, gender });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    setPaymentInfoLocal({ cardName, cardNumber, expiryDate, cvv });
    fetchUserDetails();
  }, [cardName, cardNumber, expiryDate, cvv]);

  const handleBasicInfoChange = (event) => {
    setBasicInfo({
      ...basicInfo,
      [event.target.name]: event.target.value,
    });
  };

  const handlePasswordChange = (event) => {
    setPassword({
      ...password,
      [event.target.name]: event.target.value,
    });
  };

  const handleCardChange = (event) => {
    setPaymentInfoLocal({
      ...paymentInfo,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdation = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:4000/api/v1/me/update',
        {
          username: basicInfo.username,
          email: basicInfo.email,
          mobileNumber: basicInfo.mobileNumber,
          dob: basicInfo.dob,
          gender: basicInfo.gender,
        },
        { withCredentials: true }
      );
      console.log('User Details Updated:', response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error updating user details:', error);
      toast.error(error.response.data.message);
    }
  };

  const handlePasswordUpdation = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:4000/api/v1/password/update',
        {
          oldPassword: password.oldPassword,
          newPassword: password.newPassword,
          confirmPassword: password.confirmPassword,
        },
        { withCredentials: true }
      );
      console.log('Password Updated:', response.data);
      toast.success('Password updated successfully...');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Something went wrong! Try again');
    } finally {
      setPassword({ oldPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const handlePaymentInfoUpdation = (event) => {
    event.preventDefault();
    dispatch(setPaymentInfo(paymentInfo));
    toast.success('Payment information saved in Redux store');
  };

  const clearData = () => {
    dispatch(clearPaymentInfo());
  };

  return (
    loading ? <Loader /> : (
      <MuiContainer maxWidth="lg">
        {!isAuthenticated ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1 style={{ width: '100%', textAlign: 'center' }}>Login first to access this page</h1>
            <Link to="/login">
              <button style={{ display: 'inline-block', color: 'white', border: 'none', backgroundColor: 'tomato', padding: '0.5rem 1rem', margin: '1rem 0', fontWeight: '' }}>Log In</button>
            </Link>
          </div>
        ) : (
          <Stack>
            <Box  sx={{ display: 'flex' ,justifyContent:'space-between'}}>
              <form onSubmit={handleUpdation} style={{ padding: '0 16px', marginBottom: '20px' }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={10} mt={2}>
                    <Box fontWeight="bold" fontSize={20} textAlign="center" sx={{mb:3}}>Basic Information:</Box>
                    <TextField
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      label="Name"
                      name="username"
                      value={basicInfo.username}
                      onChange={handleBasicInfoChange}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      label="Email"
                      name="email"
                      value={basicInfo.email}
                      onChange={handleBasicInfoChange}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      label="Mobile"
                      name="mobileNumber"
                      value={basicInfo.mobileNumber}
                      onChange={handleBasicInfoChange}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      type="date"
                      label="Date of birth"
                      name="dob"
                      variant="outlined"
                      value={(basicInfo.dob && basicInfo.dob.substring(0, 10)) || ''}
                      onChange={handleBasicInfoChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      label="Gender"
                      name="gender"
                      value={basicInfo.gender}
                      onChange={handleBasicInfoChange}
                    />
                    <Box textAlign="center" mt={2} mb={4}>
                      <Button type="submit" variant="contained" color="primary" onClick={handleUpdation}>
                        Save
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
              <form onSubmit={handlePasswordUpdation} style={{ padding: '0 16px', marginBottom: '20px' }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={10} mt={2}>
                    <Box fontWeight="bold" fontSize={20} textAlign="center" sx={{mb:3}}>Change Password:</Box>
                    <TextField
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      label="Old Password"
                      name="oldPassword"
                      type="password"
                      value={password.oldPassword}
                      onChange={handlePasswordChange}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={password.newPassword}
                      onChange={handlePasswordChange}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={password.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    <Box textAlign="center" mt={2} mb={4}>
                      <Button type="submit" variant="contained" color="primary">
                        Save
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
            <form onSubmit={handlePaymentInfoUpdation} style={{ padding: '0 16px' }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                  <Box fontWeight="bold" fontSize={20} textAlign="center">
                    Payment Information:
                  </Box>
                  <Box fontWeight="bold" fontSize={16} textAlign="center" sx={{mb:3}}>
                    Add card details
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                    label="Name on card"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handleCardChange}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                    label="Card number"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handleCardChange}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                    label="Expiry Date"
                    name="expiryDate"
                    value={paymentInfo.expiryDate}
                    onChange={handleCardChange}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                    label="CVV"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handleCardChange}
                  />
                </Grid>
              </Grid>
              <Box textAlign="center" mt={2} mb={4}>
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: '16px' }}>
                  Save
                </Button>
                <Button onClick={clearData} variant="contained" color="primary">
                  Clear
                </Button>
              </Box>
            </form>
          </Stack>
        )}
      </MuiContainer>
    )
  );
}

export default Profile;
