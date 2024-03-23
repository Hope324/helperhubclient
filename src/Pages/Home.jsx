import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Divider
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import axios from 'axios';
import Slider from '../Components/Carousel/HomeCarousel'



const Home = () => {
  const [fetchTitles, setFetchTitles] = useState([]);
  const [showWhy, setShowWhy] = useState([]);
  const [showFAQs, setShowFAQs] = useState([]);
  
  const fetchTitlesFromDatabase=async()=>{
    try {
      const { data } = await axios.get('https://helperhubserver.onrender.com/api/v1/allServices');
      setFetchTitles(data.allServices);
    } catch (error) {
      console.error('Error fetching titles:', error.message);
    }
  }
  

async function fetchWhyChooseUs() {
  try {
    const {data} = await axios.get('/Home/whyChooseUs.json');
    setShowWhy(data);
  } catch (error) {
    console.error(error);
  }
}
const fetchFAQs=async()=>{
  try {
    const {data}=await axios.get('/Home/faq.json');
    setShowFAQs(data);
  } catch (error) {
    console.error(error);
    
  }
}


  useEffect(() => {
    fetchTitlesFromDatabase()
    fetchWhyChooseUs();
    fetchFAQs();
    
  }, []);
  return (
    <>
    <Slider/>
    <div style={{ position: 'relative'}}>
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <Typography variant="h2" style={{ color: 'black', fontWeight: 'bold',textAlign:'center',fontFamily:'Poppins' }}>
            "Bringing comfort home"
          </Typography>
          <Typography style={{fontFamily:'Poppins', color: 'black', fontWeight: 'bold', whiteSpace: 'nowrap',textAlign:'center' }}>
            Your trusted partner for seamless service
          </Typography>
        
      </div>
      <Box
        style={{
          position:'relative',
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        <Typography variant="h4" style={{fontFamily:'Poppins', color: 'black', marginBottom: '1%', fontWeight: 'bold' }}>
          Our Featured Services
        </Typography>
        <Typography variant="h6" style={{fontFamily:'Poppins', color: 'black', marginBottom: '1%', fontWeight: 'bold' }}>
        Hire professionals,Experienced specifically for your needs
        </Typography>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          {fetchTitles && fetchTitles.length !==0 && fetchTitles.map(service => (
            <Card key={service._id} style={{ width: '200px' }}>
              <CardMedia
                component="img"
                height="140"
                image={`/ImagesFiles/AllServices/${service.imgName}.jpg`}
                alt={service.title}
                style={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" component="div" style={{ color: 'black', fontWeight: 'bold' }}>
                  {service.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

 <Divider  width='80%' sx={{margin:'5rem auto'}} />
  <Typography variant="h4" style={{fontFamily:'Poppins', color: 'black', marginBottom: '1%', fontWeight: 'bold', marginTop: '20px' }}>
  Why Choose Us
</Typography>
<Box
  style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    border: 'none',
    marginBottom: '20px',
    flexWrap: 'wrap',
  }}
>
  {showWhy && showWhy.length !==0 && showWhy.map(item => (
    <Card key={item.id} style={{ width: '100%', maxWidth: '300px', border: 'none', marginBottom: '20px' }}>
      <CardMedia
        component="img"
        image={`/ImagesFiles/WhyChooseUs/${item.imgName}.jpg`}
        alt={item.title}
        style={{ objectFit: 'contain', height: '150px' }}
      />
      <CardContent>
        <Box style={{ textAlign: 'center', border: 'none' }}></Box>
        <Typography variant="h6" component="div" style={{fontFamily:'Poppins', color: 'black', fontWeight: 'bold' }}>
          {item.title}
        </Typography>
        <Typography style={{fontFamily:'Poppins', color: 'black' }}>{item.description}</Typography>
      </CardContent>
    </Card>
  ))}
</Box>
</Box>
<Divider  width='80%' sx={{margin:'5rem auto'}} />
<Container>
      <Box
        style={{
          position: 'relative',
          textAlign: 'center',
          marginTop: '20px',
          marginBottom:'20px',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h4" style={{ color: 'black', marginBottom: '1%', fontWeight: 'bold' }}>
          FAQs
        </Typography>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {showFAQs && showFAQs.length !==0 && showFAQs.map((faq) => (
            <Accordion key={faq.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`faq-content-${faq.id}`}
                id={`faq-header-${faq.id}`}
              >
                <Typography variant="h6" style={{fontFamily:'Roboto', color: 'black', fontWeight: 'bold' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails style={{fontFamily:'Roboto',textAlign:'justify'}}>
                <Typography style={{ color: 'black' }}>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
      </Container>

    </div>
    </>
  );
};

export default Home;