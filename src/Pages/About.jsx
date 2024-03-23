import React, { useEffect, useState } from 'react';
import { Grid, Avatar, Box, Typography, Container as MuiContainer, Card, CardContent } from '@mui/material';
import axios from 'axios';
import Loader from '../Components/Loader';
function About() {
  const [showMembers,setShowMembers]=useState([]);
  const [loading,setLoading]=useState(true);
  const fetchMembersData=async()=>{
    try {
      const {data}=await axios.get("/AboutUs/MeetOurTeam/MemberCards.json");
      setShowMembers(data);
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false);
    }
  }
  useEffect(()=>{
    fetchMembersData();
  },[])
  if(loading) return <Loader/>
  return (
    <MuiContainer maxWidth="lg" style={{ marginTop: '1%', marginBottom: '1%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center">
            <Avatar
              alt="Dentists"
              src="/AboutUs/CoverImage/Cover.jpg"
              style={{ width: '100%', height: '100%', borderRadius: '8px' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
            <Typography variant="h4" style={{ fontWeight: 'bold', textAlign: 'center', fontFamily:'Poppins'}}>Welcome to HelperHub</Typography>
            <Typography variant="h6" style={{ textAlign: 'center',fontFamily:'Poppins' }}>A team of go-getters to give you a smooth experience</Typography>
            <Typography variant="body1" style={{ marginTop: '8px', textAlign: 'center',fontFamily:'Poppins' }}>
              HelperHub is dedicated to providing top-notch services to make your life easier. Our team consists of skilled professionals who are committed to delivering a seamless experience for all your needs. Whether it's assistance at home, medical support, or any other service, we've got you covered.
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Typography variant="h4" style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>Meet Our Team</Typography>
      <Grid container spacing={3} justifyContent="center" mt={2}>
        {
          showMembers && showMembers.length !==0 && 
          showMembers.map((member)=>(
          <Grid key={member.id} item xs={12} md={4}>
          <Card>
            <Avatar
              alt={`Team Member ${member.id}`}
              src={`/AboutUs/MeetOurTeam/Member${member.id}.jpg`}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
            />
            <CardContent>
              <Typography variant="h6" fontFamily='Roboto'>Team Member {member.id}</Typography>
              <Typography variant="subtitle1" fontFamily='Roboto'>{member.subtitle}</Typography>
              <Typography variant="body2" fontFamily='Roboto'>{member.body}</Typography>
            </CardContent>
          </Card>
        </Grid>
          ))
        }
      </Grid>
    </MuiContainer>
  );
}

export default About;