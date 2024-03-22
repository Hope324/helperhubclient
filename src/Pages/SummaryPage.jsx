
import { Box, Button, Container, CssBaseline, Divider, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import checkoutHandler from '../Components/Checkout';
import axios from 'axios';
import toast from 'react-hot-toast';

import { Context } from '../index';
import { useNavigate } from 'react-router-dom';
import Loader from '../Components/Loader';



const SummaryPage = () => {
 const summary = useSelector(state => state.serviceReducer);
  const navigate = useNavigate();
  const {isAuthenticated,loading,setLoading,orderId,setOrderId}=useContext(Context);
  const handleCheckout = async() => {
    try {
      if (!isAuthenticated) {
        toast.error("Login first to avail your service and make payment");
        navigate('/login', { state: { fromSummary: true } });
        return;
      }
      setLoading(true);
      const {data}=await axios.post("http://localhost:4000/api/v1/user/purchase/order",
        {
          Title:summary.Title,
          Location:summary.Location,
          Gender:summary.Gender,
          TotalPrice:2350,
          ServiceDescription:summary.obj,
          BasicPay:summary.basicPay,
          AddOns:summary.addOns
          
      }
      ,{withCredentials:true})
      if (data && data.success) {
        const latestOrder = data.orderArr[data.orderArr.length - 1]; 
        if (latestOrder && latestOrder._id) {
          setOrderId(latestOrder._id);
          console.log("Latest OrderId after setting:", latestOrder._id);
          toast.success(data.message);
          checkoutHandler(summary.TotalPrice);
        } 
      }
      checkoutHandler(summary.TotalPrice);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Try again");
    }finally{
      setLoading(false)
    }
  }
    
  
  useEffect(() => {
    console.log('orderId:', orderId);
  }, [orderId]);
  if(loading) return <Loader/>
  return (
    <Container maxWidth="md" style={{ marginTop: '50px' }}>
      <CssBaseline />
      <Box textAlign="center" boxShadow={3} p={3} borderRadius={4} bgcolor="white">
        <Stack spacing={2}>
          <Typography variant="h5">Service Details</Typography>
          <Typography variant="body1"><strong>Name of service:</strong> {summary.Title}</Typography>
          <Typography variant="body1"><strong>Your location:</strong> {summary.Location}</Typography>
          <Typography variant="body1"><strong>Your preference for gender of service provider</strong>: {summary.Gender}</Typography>
          {(summary.basicPay && Object.keys(summary.basicPay).length !== 0) && (Object.keys(summary.basicPay).map((key)=>(
             <Stack key={key} direction="row" justifyContent="center" alignItems="center" mt={2}>
             <Typography variant="body1" fontWeight="bold" mr={1}>{key}:</Typography>
             <Typography variant="body1">₹{summary.basicPay[key]}/-</Typography>
           </Stack>
          )))}

          
          {Object.keys(summary.addOns).length!==0 && (Object.keys(summary.addOns).map((key) => (
            <Stack key={key} direction="row" justifyContent="center" alignItems="center" mt={2}>
              <Typography variant="body1" fontWeight="bold" mr={1}>{key}:</Typography>
              <Typography variant="body1">₹{summary.addOns[key]}/-</Typography>
            </Stack>
          ))
          )}
          <Typography variant="body1" bgcolor="lightgreen" fontWeight={900}>Total Price: ₹{summary.TotalPrice}/-</Typography>
        </Stack>
      </Box>

      <Box mt={4}>
        <Divider />
      </Box>

      <Box mt={4}>
        <Box textAlign="center">
          <Typography variant="h5">Additional Options</Typography>
        </Box>
        <Box>
          {Object.keys(summary.obj).map((key) => (
            <Stack key={key} direction="row" justifyContent="center" alignItems="center" mt={2}>
              <Typography variant="body1" fontWeight="bold" mr={1}>{key}:</Typography>
              <Typography variant="body1">{summary.obj[key]}</Typography>
            </Stack>
          ))}
        </Box>
      </Box>
      <Box m={4} textAlign="center">
        <Button variant="contained" color="primary" onClick={handleCheckout} disabled={loading}>
          Proceed to Checkout
        </Button>
      </Box>
    </Container>
  );
};
export default SummaryPage;
