import React, { useCallback, useContext, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Button,
  Container,
  Typography,
  Paper,
  CssBaseline,
} from '@mui/material';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Context } from '../index';



const PaymentPage = () => {
  const {orderId,setOrderId}=useContext(Context)
  console.log(orderId);
  const saveUserPurchaseDetails=useCallback(async()=>{
    try {
      const {data}=await axios.put(`http://localhost:4000/api/v1/user/purchase/order/${orderId}`,{},{withCredentials:true})
      console.log(data)
      toast.success(data.message);
    } catch (error) {
      toast.error("Something went wrong! Try again");
      console.log(error);
    }finally{
      setOrderId('');
    }
  },[orderId,setOrderId])
  useEffect(()=>{
    saveUserPurchaseDetails();
  },[saveUserPurchaseDetails])

  const searchQuery = useSearchParams()[0];
  const refNo = searchQuery.get('reference');

  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent:'center'
  };

  const buttonStyle = {
    margin: '20px 0',
    backgroundColor: '#000000',
    color: 'white',
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} sx={pageStyle}>
        <Typography variant="h6">PAYMENT SUCCESSFUL</Typography>
        <Typography variant="body1">Reference Number:<br/>{refNo}</Typography>
        <Link to={'/'}>
          <Button variant="contained" style={buttonStyle}>
            Back to Home Page
          </Button>
        </Link>
      </Paper>
    </Container>
  );
};

export default PaymentPage;