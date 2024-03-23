import React, { useCallback, useContext, useEffect, useState } from 'react';
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
  const [oId,setOId]=useState('');
  const searchQuery = useSearchParams()[0];
  const refNo = searchQuery.get('reference');
  const {user}=useContext(Context);
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent:'center',
    marginTop:'10rem'
  };

  const buttonStyle = {
    margin: '20px 0',
    backgroundColor: '#000000',
    color: 'white',
  };
  const saveUserPurchaseDetails = useCallback(async () => {
    try {
      const { data } = await axios.put(`https://helperhubserver.onrender.com/api/v1/user/${user._id}/purchase/order/${oId}`, {}, { withCredentials: true });
      console.log(data);
      toast.success(data.message);
    } catch (error) {
      toast.error("Something went wrong! Try again");
      console.log(error);
    }
  },[user._id,oId])
 
  useEffect(() => {
    const getIdFromLocalStorage=JSON.parse(localStorage.getItem('orderId'))
      if(getIdFromLocalStorage){
        setOId(getIdFromLocalStorage)
      }
      if (oId) {
        saveUserPurchaseDetails();
      }
      
  }, [oId, saveUserPurchaseDetails]);
  return (
    <Container component="main" style={{minHeight:'64.7vh'}}>
      <CssBaseline />
      <Typography variant={'h5'} color={'green'} fontWeight={'bold'} textAlign={'center'} mt={4}>Congratulations! Your payment is successfully done.</Typography>
      
      <Paper elevation={3} sx={pageStyle}>
        <Typography variant="h6">PAYMENT SUCCESSFULL</Typography>
        <Typography variant="body1">Reference Number: {refNo}</Typography>
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