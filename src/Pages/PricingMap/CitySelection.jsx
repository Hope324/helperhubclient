import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Button, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Loader from '../../Components/Loader';

const CitySelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [cities,setCities]=useState([]);
  const [loading,setLoading]=useState(true);
 useEffect(()=>{
    fetchAllLocations();
 },[])
 const fetchAllLocations=async()=>{
  try {
    const {data:{allLocations}}=await axios.get("http://localhost:4000/api/v1/location");
    setCities(allLocations);
  } catch (error) {
    console.log(error.response);
  }finally{
    setLoading(false);
  }
 }
  const handleCitySelection = (cityName) => {
    setSelectedCity(cityName);

    dispatch({ type: "addLocation", payload: { key: "Location", value: cityName } });
  };

  const moveNext = () => {
    if(selectedCity===''){
      toast.error("Select your city to move further");
      return;
    }
    else{
      navigate("/ServiceSelection");
    }
  };
  if(loading) return <Loader/>
  return (
    <Box margin={2}>
      <Typography variant="h4" align="center" fontWeight="bold" margin={2}>
        Select Your City
      </Typography>
      <Typography variant="h5" align="center" margin={2}>
        I'm looking for a Helper in your city.
      </Typography>
      <Grid container spacing={2}>
        {cities.map((city, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={selectedCity === city.label ? 4 : 1}
              onClick={() => handleCitySelection(city.label)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: selectedCity === city.label ? '#f0f0f0' : 'white',
                border: selectedCity === city.label ? '2px solid #3f51b5' : '2px solid transparent',
                borderRadius: '10px'
              }}
            >
              <img
                src={`/ImagesFiles/Location/${city.icon}.jpg`}
                alt={`${city.label} Icon`}
                style={{ width: '20vw', height:'30vh', marginBottom: '10px', borderRadius: '2rem' }}
              />
              <Typography variant="h6" fontWeight={'900'}>{city.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h5" align="center" margin={2}>
        Select the location where you'd like to book a Helper
      </Typography>
      <Box mt={4} textAlign="center">
        <Button variant="contained" color="primary" style={{opacity:selectedCity===''? 0.5:1}}  onClick={moveNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default CitySelection;
