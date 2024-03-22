
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Components/Loader';
import { Typography, Container, Paper, FormControlLabel, Checkbox } from '@mui/material';
import { Context } from '../index';

const MessageDetail = () => {
  const { userId, messageId } = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResolved, setIsResolved] = useState(false);
  const [name, setName] = useState('');
  const [ticketStatus, setTicketStatus] = useState("Pending");

  
  const { user } = useContext(Context);

  const spanStyle = {
    fontSize: '0.7rem'
  };

  const handleCheckboxChange = () => {
    setIsResolved(!isResolved); 
    if (!isResolved) {
      setName(user.username); 
      setTicketStatus("Resolved");
    } else {
      setName(''); 
      setTicketStatus("Pending");
    }
  };

  const fetchMessage = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:4000/api/v1/contact/user/${userId}/message/${messageId}`, { withCredentials: true });
      setMessage(data.message);
      if(data.message.ticket.status==="Resolved"){
        setIsResolved(true)
      }
      else{
        setIsResolved(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId, messageId]);

  const updateMessageStatus = useCallback(async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/v1/contact/user/${userId}/message/${messageId}`,
        { status: isResolved ? 'Resolved' : 'Pending', adminName: isResolved ? name : 'None' },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  }, [userId, messageId, isResolved, name]);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);

  useEffect(() => {
    if (message) {
      updateMessageStatus();
    }
  }, [message, updateMessageStatus]);

  if(loading) return <Loader/>;
  
  return (
    <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper sx={{ padding: 4, width: '80%', maxWidth: '600px', backgroundColor:!isResolved?'red':'green',color:'white' }}>
        <Typography variant="h4" gutterBottom textAlign="center">Message Details <span style={spanStyle}>({message?.user})</span>-</Typography>
        <Typography variant="body1" mb={1} fontWeight="bold" sx={{overflowWrap:'break-word'}}>Message: {message?.message}</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={isResolved}
              onChange={handleCheckboxChange}
              name="ticket"
            />
          }
          label={!isResolved ? "Ticket is pending" : "Ticket resolved"}
        />
      </Paper>
    </Container>
  );
};

export default MessageDetail;
