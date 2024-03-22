
import React, { useContext, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WebIcon from '@mui/icons-material/Web';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Context } from '../index'; 
import toast from 'react-hot-toast';

const ContactUs = () => {
  const { loading, setLoading, user ,unseenMessage,setUnseenMessage} = useContext(Context); 
  const [message, setMessage] = useState('');
  
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const {data} = await axios.post('http://localhost:4000/api/v1/contact',{message},{withCredentials:true});
      toast.success(data.message)
      setMessage('');
      setUnseenMessage(unseenMessage+1);
    
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Try again")
    } finally{
      setLoading(false);
    }
  };
  const fieldStyle={ color: 'rgba(0,0,0,0.6)', fontSize: '18px', fontFamily: 'sans-serif' };
  const legendStyle={ color: 'rgba(0,0,0,0.6)', fontSize: '18px', fontFamily: 'sans-serif' };
  const fieldsetStyle={ border: '1px solid rgba(0,0,0,0.3)', borderRadius: '5px', margin: '0.5rem', padding: '0.8rem' };

  return (
    <Container maxWidth="lg" sx={{py:'5rem',minHeight:'64.5vh'}}>
      <Grid container spacing={3}>
        
        <Grid item xs={12} sm={6}>
          <form onSubmit={submitHandler}>
            <Typography variant="h5" style={{ fontWeight: 'bolder' }} gutterBottom>
              Contact Information
            </Typography>
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>Username*</legend>
              <div style={fieldStyle}>{user ? user.username : ''}</div>
            </fieldset>
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>Email*</legend>
              <div style={fieldStyle}>{user ? user.email : ''}</div>
            </fieldset>
            <fieldset style={fieldsetStyle}>
              <legend style={legendStyle}>Mobile Number*</legend>
              <div style={fieldStyle}>{user ? user.mobileNumber : ''}</div>
            </fieldset>
            <TextField
              label="Message"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              name="message"
              required
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
            />
            <Button type="submit" variant="contained" disabled={loading} color="primary" style={{ color: '#fff', marginTop: '1rem' }}>
              Submit
            </Button>
          </form>
        </Grid>
        
            <Grid item xs={12} sm={6} style={{ position: 'relative' }}>
              <img
                src={"ImagesFiles/ContactUs/Map.jpg"}
                alt="Map"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  color: '#000',
                  backdropFilter: 'blur(5px)',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton color="inherit" style={{ fontSize: 40, marginRight: 10 }}>
                    <LocationOnIcon />
                  </IconButton>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Address: 198 West 21th Street, Suite 721 New York NY 10016
                  </Typography>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                  <IconButton color="inherit" style={{ fontSize: 40, marginRight: 10 }}>
                    <PhoneIcon />
                  </IconButton>
                  <Typography variant="subtitle1" fontWeight="bold">Phone: +1235 2355 98</Typography>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                  <IconButton color="inherit" style={{ fontSize: 40, marginRight: 10 }}>
                    <EmailIcon />
                  </IconButton>
                  <Typography variant="subtitle1" fontWeight="bold">Email: info@yoursite.com</Typography>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                  <IconButton color="inherit" style={{ fontSize: 40, marginRight: 10 }}>
                    <WebIcon />
                  </IconButton>
                  <Typography variant="subtitle1" fontWeight="bold">Website: yoursite.com</Typography>
                </div>
              </div>
            </Grid>
      </Grid>
    </Container>
  );
};

export default ContactUs;
