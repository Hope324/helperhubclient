
import React from 'react';
import { Card, CardContent, Typography, Grid, IconButton, CardMedia } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Container } from '@mui/system';

const ServiceGrid = ({ services, handleDelete, handleEdit }) => {
  return (
    
    <Container style={{ marginTop: '1%', marginBottom: '1%' }}>
      <Grid container spacing={10} sx={{ justifyContent: 'center', rowGap: '20px',minHeight:'auto' }}>
        {services.map((service)=>(
          <Grid item key={service._id} xs={12} md={6} height={"auto"}>
          <Card sx={{ width: '100%', height: '100%', borderRadius: '15px' }}>
            <CardMedia
              component="img"
              alt="Service Image"
              height="500px"
              width="100%"
              border="10px solid black"
              image={`/ImagesFiles/AllServices/${service.imgName}.jpg`}
            />
            <CardContent>
              <Typography variant="h6"><strong>Title: </strong>{service.title}</Typography>
              <Typography variant="body2"><strong>Description: </strong>{service.description}</Typography>
              <Typography variant="body2"><strong>Image File Name: </strong>{service.imgName}</Typography>
              <Typography variant="body2"><strong>Heading: </strong> {service.heading}</Typography>

              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <IconButton onClick={() => handleEdit(service)} aria-label="edit" size="small" title="Edit">
                  <EditIcon style={{transform:'scale(1.2)',color:'grey'}}/>
                </IconButton>
                <IconButton onClick={() => handleDelete(service._id)} aria-label="delete" size="small" title="Delete">
                  <DeleteIcon style={{transform:'scale(1.2)',color:'red'}} />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        ))}
       
      </Grid>
    </Container>
  );
};

export default ServiceGrid;
