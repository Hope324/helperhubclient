

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TextField, Button, Grid, Box, Container as MuiContainer, Card, CardContent, Typography, Divider } from '@mui/material';
import { Context } from '../index';
import Loader from '../Components/Loader';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { clearPaymentInfo, setPaymentInfo } from '../Redux/paymentReducer';
import { Stack } from '@mui/system';


function Profile() {
  const { isAuthenticated, loading, user } = useContext(Context);
  const dispatch = useDispatch();
  const { cardName, cardNumber, expiryDate, cvv } = useSelector((state) => state.paymentReducer);
  const [newOrder, setNewOrder] = useState('');
  const [oId, setOId] = useState('');
  const [ordersList,setOrdersList]=useState([]);
  const [userId,setUserId]=useState('');
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
      const response = await axios.get('https://helperhubserver.onrender.com/api/v1/userDetails', { withCredentials: true });
      const { username, email, mobileNumber, dob, gender } = response.data.user;
      setBasicInfo({ username, email, mobileNumber, dob, gender });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const getNewOrderDetails = useCallback(async () => {
    try {
      const { data } = await axios.get(`https://helperhubserver.onrender.com/api/v1/user/${user._id}/purchase/order/${oId}`, { withCredentials: true });
      setNewOrder(data.order);
    } catch (error) {
      console.log(error);
    }
  }, [oId, user._id]);
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN');
  };
  const fetchAllOrdersList=useCallback(async()=>{
    try {
      const {data}=await axios.get(`https://helperhubserver.onrender.com/api/v1/purchases/user/${userId}/allOrders`,{withCredentials:true});
      setOrdersList(data.purchases);
    } catch (error) {
      console.log(error);
    }
  },[userId])
  useEffect(() => {
    setPaymentInfoLocal({ cardName, cardNumber, expiryDate, cvv });
    fetchUserDetails();
    const getIdFromLocalStorage = JSON.parse(localStorage.getItem('orderId'))
    if (getIdFromLocalStorage) {
      setOId(getIdFromLocalStorage)
    }
    if (oId) {
      getNewOrderDetails();
    }
    
  }, [cardName, cardNumber, expiryDate, cvv, oId, getNewOrderDetails]);
  useEffect(()=>{
    setUserId(user._id);
    if(userId){
    fetchAllOrdersList()
    }
  },[user._id,userId,fetchAllOrdersList])
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
        'https://helperhubserver.onrender.com/api/v1/me/update',
        {
          username: basicInfo.username,
          email: basicInfo.email,
          mobileNumber: basicInfo.mobileNumber,
          dob: basicInfo.dob,
          gender: basicInfo.gender,
        },
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error updating user details:', error);
      toast.error(error.response.data.message);
    }
  };

  const handlePasswordUpdation = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        'https://helperhubserver.onrender.com/api/v1/password/update',
        {
          oldPassword: password.oldPassword,
          newPassword: password.newPassword,
          confirmPassword: password.confirmPassword,
        },
        { withCredentials: true }
      );
      toast.success('Password updated successfully...');
    } catch (error) {
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
            <Box  sx={{ display: 'flex', justifyContent:'space-between'}}>
              <form onSubmit={handleUpdation} style={{ padding: '0 16px', marginBottom: '20px', flex: '1' }}>
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
              <form onSubmit={handlePasswordUpdation} style={{ padding: '0 16px', marginBottom: '20px', flex: '1' }}>
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
            <form onSubmit={handlePaymentInfoUpdation} style={{ padding: '0 16px', flex: '1' }}>
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
          <Divider/>
            <Box sx={{ width: '100%', textAlign: 'center', marginTop:'4rem' }}>
  <Typography component="h1" variant="h3" fontWeight="bold" sx={{ marginBottom: 2 }}>
    Latest order-
  </Typography>
</Box>
<Grid container spacing={2} justifyContent="center">
  <Grid item md={12}>
    {newOrder && (
      <Card sx={{ display: 'flex', flexDirection: 'column', height: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" textAlign={'center'}><strong>Service:</strong> {newOrder.Title}</Typography>
              <Typography variant="h6" textAlign={'center'}><strong>Location:</strong> {newOrder.Location}</Typography>
              <Typography variant="h6" textAlign={'center'}><strong>Gender:</strong> {newOrder.Gender}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              {(newOrder.BasicPay && Object.keys(newOrder.BasicPay).length !== 0) && (
                <>
                  <Typography variant="h6" textAlign={'center'}><strong>Basic Pay-</strong></Typography>
                  {Object.keys(newOrder.BasicPay).map((key) => (
                    <Stack key={key} direction="row" justifyContent="center" alignItems="center" mt={1}>
                      <Typography variant="body1"><strong>{key}: </strong></Typography>
                      <Typography variant="body1">₹{newOrder.BasicPay[key]}/-</Typography>
                    </Stack>
                  ))}
                </>
              )}
              {(newOrder.AddOns && Object.keys(newOrder.AddOns).length !== 0) && (
                <>
                  <Typography variant="h6" textAlign={'center'} mt={2}><strong>Add Ons-</strong></Typography>
                  {Object.keys(newOrder.AddOns).map((key) => (
                    <Stack key={key} direction="row" justifyContent="center" alignItems="center" mt={1}>
                      <Typography variant="body1"><strong>{key}: </strong></Typography>
                      <Typography variant="body1">₹{newOrder.AddOns[key]}/-</Typography>
                    </Stack>
                  ))}
                </>
              )}
            </Grid>
          </Grid>
          <Typography variant="h6" textAlign={'center'} mt={2}><strong>Total Price: </strong> ₹{newOrder.TotalPrice}</Typography>
          <Typography variant="h6" textAlign={'end'} mt={2}>{formatTime(newOrder.createdAt)}, {formatDate(newOrder.createdAt)}</Typography>
        </CardContent>
      </Card>
    )}
  </Grid>
</Grid>
<Divider style={{height:'3rem'}}/>
          <Grid container spacing={2} justifyContent="center" mt={5} >
  <Grid item md={12}>
    <Typography variant='h3' textAlign={'center'}><strong>Total orders- </strong> {ordersList.length}</Typography>
    {ordersList.map((order) => (
      <Grid key={order._id} item>
        <Card sx={{ display: 'flex', flexDirection: 'column',marginTop:'2rem' ,height: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" textAlign={'center'}><strong>Service:</strong> {order.Title}</Typography>
                <Typography variant="h6" textAlign={'center'}><strong>Location:</strong> {order.Location}</Typography>
                <Typography variant="h6" textAlign={'center'}><strong>Gender:</strong> {order.Gender}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                {(order.BasicPay && Object.keys(order.BasicPay).length !== 0) && (
                  <>
                    <Typography variant="h6" textAlign={'center'}><strong>Basic Pay-</strong></Typography>
                    {Object.keys(order.BasicPay).map((key) => (
                      <Stack key={key} direction="row" justifyContent="center" alignItems="center" mt={1}>
                        <Typography variant="body1"><strong>{key}: </strong></Typography>
                        <Typography variant="body1">₹{order.BasicPay[key]}/-</Typography>
                      </Stack>
                    ))}
                  </>
                )}
                {(order.AddOns && Object.keys(order.AddOns).length !== 0) && (
                  <>
                    <Typography variant="h6" textAlign={'center'} mt={2}><strong>Add Ons-</strong></Typography>
                    {Object.keys(order.AddOns).map((key) => (
                      <Stack key={key} direction="row" justifyContent="center" alignItems="center" mt={1}>
                        <Typography variant="body1"><strong>{key}: </strong></Typography>
                        <Typography variant="body1">₹{order.AddOns[key]}/-</Typography>
                      </Stack>
                    ))}
                  </>
                )}
              </Grid>
            </Grid>
            <Typography variant="h6" textAlign={'center'} mt={2}><strong>Total Price: </strong> ₹{order.TotalPrice}</Typography>
            <Typography variant="h6" textAlign={'end'} mt={2}>{formatTime(order.createdAt)}, {formatDate(order.createdAt)}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Grid>


        </Stack>
        )}
      </MuiContainer>
    )
  );
}

export default Profile;
