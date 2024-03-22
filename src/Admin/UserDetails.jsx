

import React, { useState, useEffect, useContext, useRef } from 'react';
import { Typography, Container, Box, Paper, Badge } from '@mui/material';
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

  const { unseenMessage, setUnseenMessage,setPendingTickets } = useContext(Context);

  const messagesContainerRef = useRef(null);

  const fetchUserDetails = async (userId) => {
    try {
      const { data } = await axios.get(`http://localhost:4000/api/v1/admin/user/${userId}`, { withCredentials: true });
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageDisplay = async () => {
    setShowMessage(!showMessage);
    try {
      const { data } = await axios.get(`http://localhost:4000/api/v1/contact/${userId}`, { withCredentials: true });
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

  useEffect(() => {
    fetchUserDetails(userId);
  }, [userId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const height = showMessage ? messagesContainerRef.current.scrollHeight : 0;
      messagesContainerRef.current.style.height = `${height}px`;
    }
    
  }, [showMessage, displayMessages,setPendingTickets]);

  if (loading) return <Loader />;

  return (
    <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper sx={{ padding: 2, width: '80%', maxWidth: '600px' }}>
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
      
    </Container>
  );
};

export default UserDetails;

