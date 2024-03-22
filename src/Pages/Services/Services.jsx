import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Loader from '../../Components/Loader';


const ServicesCard = ({ title, imgName }) => {
  const history = useNavigate();
  const cardStyles = {
    maxWidth: 300,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 4s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.3s ease-in-out',
    margin: '0 1rem 2rem',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  };

  const imageStyles = {
    width: '100%',
    height: '25vh',
    objectFit: 'cover',
    borderRadius: '16px',
    transition: 'transform 4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  };

  const titleStyles = {
    position: 'absolute',
    top: '0',
    right: '0',
    padding: '8px',
    color: 'black',
    fontSize: '1rem',
    fontWeight: 'bold',
  };

  const buttonStyles = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    margin: '8px',
    backgroundColor: 'black',
    color: '#fff', 
  };
  const handleBookNow = () => {
     history(`/service/${title}`);
  };
  
  return (
    <Paper style={cardStyles}>
      <img src={`/ImagesFiles/AllServices/${imgName}.jpg`} alt="" style={imageStyles} />
      <div style={titleStyles}>{title}</div>
      <Button variant="contained" style={buttonStyles} onClick={handleBookNow}>
        Book Now
      </Button>
    </Paper>
  );
};

const ServicesPage = () => {
  const [servicesData,setServicesData]=useState([])
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    fetchAllServices();
     
  },[])
  const fetchAllServices=async()=>{
    try {
      const {data:{allServices}}=await axios.get("http://localhost:4000/api/v1/allServices");
      setServicesData(allServices)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false);
    }
  }
  const containerStyles = {
    maxWidth: 1000,
    margin: '0 auto',
    padding: '2rem',
    display: 'flex',
    flexWrap: 'wrap', 
    justifyContent: 'center',
  };
  const headingStyles = {
    fontSize: '2rem',
    marginBottom: '1rem',
  }
  if(loading) return <Loader/>
  return (
    <div style={containerStyles}>
    <h1 style={headingStyles}>Services</h1>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {servicesData.map((service, index) => (
        <ServicesCard key={index} {...service} />
      ))}
    </div>
  </div>
  );
};

export default ServicesPage;