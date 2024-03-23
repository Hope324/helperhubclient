

import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Typography, Container, Box, Paper, Badge, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../Components/Loader';
import { Stack } from '@mui/system';
import MailIcon from '@mui/icons-material/Mail';
import { Context } from '../index';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [displayMessages, setDisplayMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [allOrders,setAllOrders]=useState([]);
  const { unseenMessage, setUnseenMessage,setPendingTickets } = useContext(Context);

  const messagesContainerRef = useRef(null);

  const fetchUserDetails = async (userId) => {
    try {
      const { data } = await axios.get(`https://helperhubserver.onrender.com/api/v1/admin/user/${userId}`, { withCredentials: true });
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN');
  }
  const handleMessageDisplay = async () => {
    setShowMessage(!showMessage);
    try {
      const { data } = await axios.get(`https://helperhubserver.onrender.com/api/v1/contact/${userId}`, { withCredentials: true });
      if (!data.allMessages) {
        toast.success(data.message);
      }
      setDisplayMessages(data.allMessages);
      setUnseenMessage(0);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Try again");
    }
  };

  const handleMessageStatus = async (messageId) => {
    navigate(`/admin/user-details/user/${userId}/message/${messageId}`, { state: { messageId } });
  };
  const fetchAllOrders=useCallback(async()=>{
    try {
      const {data}=await axios.get(`https://helperhubserver.onrender.com/api/v1/purchases/user/${userId}/allOrders`,{withCredentials:true})
      setAllOrders(data.purchases)
    } catch (error) {
      console.log(error);
    }
  },[userId])
  useEffect(() => {
    fetchUserDetails(userId);
  }, [userId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const height = showMessage ? messagesContainerRef.current.scrollHeight : 0;
      messagesContainerRef.current.style.height = `${height}px`;
    }
    fetchAllOrders();
  }, [showMessage, displayMessages,setPendingTickets,fetchAllOrders]);

  if (loading) return <Loader />;

  return (
    <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper sx={{ padding: 2, width: '80%', maxWidth: '1000px' }}>
        <Typography variant="h4" gutterBottom textAlign="center" style={{ backgroundColor: 'blue', color: 'white', padding: '0.5rem' }}>User Details</Typography>
        <Box sx={{ marginBottom: 2, textAlign: 'center', mx: 'auto' }}>
          <Typography variant="h6" mb={1} fontWeight="bold">Username: {user.username}</Typography>
          <Typography variant="body1" mb={1} fontWeight="bold">Email: {user.email}</Typography>
          <Typography variant="body1" mb={1} fontWeight="bold">Mobile Number: {user.mobileNumber}</Typography>
          <Typography variant="body1" mb={1} fontWeight="bold">Role: {user.role}</Typography>
          <Typography variant="body1" mb={1} fontWeight="bold">Gender: {user.gender}</Typography>
          <Typography variant="body1" mb={1} fontWeight="bold">Date of Birth: {new Date(user.dob).toLocaleDateString()}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
            <Badge badgeContent={unseenMessage} style={{ cursor: 'pointer' }} color="secondary" onClick={handleMessageDisplay}>
              <MailIcon color="primary" sx={{ transform: 'scale(1.5)' }} />
            </Badge>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <div style={{height:'1rem',width:'1rem',backgroundColor:'grey',marginRight:'0.5rem'}}></div>
              <Typography variant="body2" className="status-text">Unseen Messages</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <div style={{height:'1rem',width:'1rem',backgroundColor:'red',marginRight:'0.5rem'}}></div>
              <Typography variant="body2" className="status-text">Ticket Pending</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <div style={{height:'1rem',width:'1rem',backgroundColor:'green',marginRight:'0.5rem'}}></div>
              <Typography variant="body2" className="status-text">Ticket Resolved</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Stack
        ref={messagesContainerRef}
        flexDirection={'column'}
        spacing={'1rem'}
        sx={{ width: '50%', margin: 'auto', overflowY: 'auto', border: showMessage?'5px solid grey':'none', borderRadius: '2rem' }}
      >
        {showMessage && displayMessages && displayMessages.length !== 0 && (
          displayMessages.map((item) => {
            const messageDate = new Date(item.createdAt);
            return (
              <Box
                key={item._id}
                onClick={() => handleMessageStatus(item._id)}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  minHeight: '4rem',
                  alignItems: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '2rem',
                  px:'1rem',
                  backgroundColor:
                    item.isSeen ?
                      (item.ticket.status === "Resolved" ? 'green' : 'red')
                      : 'grey',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <Typography variant="body1" style={{ wordWrap: 'break-word', width: '70%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {item.message}
                </Typography>
                <Typography variant="body2" sx={{ mb: '0', alignSelf: 'flex-end' }} >
                  {messageDate.toLocaleDateString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    
                  })}
                </Typography>
              </Box>
            );
          })
        )}
      </Stack>
      
      <Paper sx={{ padding: 2, width: '80%', maxWidth: '1000px', marginTop:'5rem'}}>
        <Typography variant="h4" gutterBottom textAlign="center" style={{ backgroundColor: 'blue', color: 'white', padding: '0.5rem' }}>All orders:</Typography>
        <Box sx={{ marginBottom: 2, textAlign: 'center', mx: 'auto' }}>
        <Grid container spacing={2} justifyContent="center" mt={5} >
  <Grid item md={12}>
    <Typography variant='h3' textAlign={'center'}><strong>Total orders- </strong> {allOrders.length}</Typography>
    {allOrders && allOrders.map((order) => (
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

        </Box>
      </Paper>
    </Container>
  );
};

export default UserDetails;

