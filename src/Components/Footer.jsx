
import React from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'black',
        color: 'white',
        padding: '2rem 1rem',
        width: '100%', 
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end', 
          flexWrap: 'wrap',
          gap: '4rem', 
           
          padding: '0 20px',
        }}
      >
  
        <Box sx={{ flex: '1 1 250px',textAlign:'justify' }}>
          <Typography variant="h6" fontFamily="Poppins" gutterBottom>
            Follow Us On
          </Typography>
          <IconButton color="inherit" component={Link} href="#">
            <FacebookIcon />
          </IconButton>
          <IconButton color="inherit" component={Link} href="#">
            <TwitterIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom fontFamily="Poppins">
            HelperHub
          </Typography>
          <Typography variant="body2" fontFamily="Poppins">
            HelperHub is your dedicated partner in creating a nurturing home environment. Explore our range of
            services designed to make your life easier and more enjoyable. Whether you're seeking reliable caregivers,
            professional nursing assistance, or efficient housekeeping, we're here to cater to your unique needs.
          </Typography>
        </Box>


        <Box sx={{ flex: '1 1 250px', textAlign: 'center'}}>
          <Typography variant="body2" fontFamily="Poppins" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/home" color="inherit">
              Home
            </Link>
            <Link href="/services/All services" color="inherit">
              Services
            </Link>
            <Link href="/about" color="inherit">
              About Us
            </Link>
            <Link href="/contact" color="inherit">
              Contact Us
            </Link>
          </Typography>
        </Box>

    
        <Box sx={{ flex: '1 1 250px', textAlign: 'justify' }}>
          <Typography variant="body2">
            <Typography fontFamily="Poppins">HelperHub—Your Partner in Home Wellness</Typography>
            <Typography fontFamily="Poppins" style={{ margin: '0.4rem 0' }}>
              Elevate your living experience with our trusted and compassionate services. At HelperHub, we're not
              just caregivers; we're family.
            </Typography>
            <Typography fontFamily="Poppins">© 2024 HelperHub. All rights reserved</Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
