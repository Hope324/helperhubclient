

import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, Card, CardContent, CardActions, IconButton, Modal, CardMedia, Divider } from '@mui/material';

import axios from 'axios';
import Loader from '../Components/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import toast from 'react-hot-toast';

const AllServices = () => {
  const [servicesData, setServicesData] = useState({ title: '', imgName: '' });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchAllServices();
  }, []);

  const fetchAllServices = async () => {
    setLoading(true);
    try {
      const {data} = await axios.get('http://localhost:4000/api/v1/allServices');
      setServices(data.allServices);
    } catch (error) {
       console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceForm = async (e) => {
    e.preventDefault();
    try {
      const {data}=await axios.post('http://localhost:4000/api/v1/admin/allServices/add', servicesData,{withCredentials:true});
      fetchAllServices();
      toast.success(data.message)
      setServicesData({ title: '', imgName: '' });
    } catch (error) {
       toast.error("Something went wrong! Try again");
    }
  };

  const handleUpdateService = async (id, updatedData) => {
    try {
      const {data}=await axios.put(`http://localhost:4000/api/v1/admin/allServices/service/${id}`, updatedData,{withCredentials:true});
      fetchAllServices();
      toast.success(data.message);
    } catch (error) {
      toast.error("Something went wrong! Try again");
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const {data}=await axios.delete(`http://localhost:4000/api/v1/admin/allServices/service/${id}`,{withCredentials:true});
      fetchAllServices();
      toast.success(data.message)
    } catch (error) {
      toast.error("Something went wrong! Try again");
      
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServicesData((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));
  };

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (loading) return <Loader />;
  
  return (
    <Container component="main" maxWidth="lg" sx={{ width: '80%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,180,0.3)',
          borderRadius: '2px',
          margin: '1rem',
          padding: '1rem',
        }}
      >
        <Typography component="h1" variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
          Add services
        </Typography>
        <Divider/>
        <form onSubmit={handleServiceForm} style={{ width: '100%' }}>
          <TextField
            fullWidth
            type="text"
            label="Title"
            name="title"
            required
            variant="outlined"
            value={servicesData.title}
            onChange={handleChange}
            sx={{ marginBottom: 1.5 }}
          />
          <TextField
            fullWidth
            type="text"
            label="Name of Image"
            name="imgName"
            required
            variant="outlined"
            value={servicesData.imgName}
            onChange={handleChange}
            sx={{ marginBottom: 1.5 }}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ marginBottom: 2 }}>
            Post the service
          </Button>
        </form>
        <Typography component="h1" variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
          Services List
        </Typography>
        <Grid container spacing={2}>
          {services.map((service) => (
            <Grid item key={service._id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ display: 'flex', flexDirection: 'column',height:'500px' }}>
                <CardMedia 
                  component="img"
                  alt="All services"
                  height="70%"
                  width="100%"
              
                  image={`/ImagesFiles/Allservices/${service.imgName}.jpg`}               
                />
                <CardContent style={{height:'150px'}}>
                  <Typography variant="h6"><strong>Title: </strong>{service.title}</Typography>
                  <Typography variant="h6"><strong>File name: </strong>{service.imgName}</Typography>

                  
                </CardContent>
                <CardActions style={{justifyContent:'space-between'}}>
                 
                   <IconButton onClick={() => handleOpenModal(service)} aria-label="edit" size="small" title="Edit">
                      <EditIcon style={{transform:'scale(1.2)',color:'grey'}}/>
                    </IconButton>
                    <IconButton onClick={() => handleDeleteService(service._id)} aria-label="delete" title="Delete">
                      <DeleteIcon style={{transform:'scale(1.2)',color:'red'}} />
                    </IconButton>
                    
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <ServiceModal
        open={openModal}
        handleClose={handleCloseModal}
        handleUpdateService={handleUpdateService}
        service={selectedService}
      />
    </Container>
  );
};

const ServiceModal = ({ open, handleClose, handleUpdateService, service }) => {
  const [updatedService, setUpdatedService] = useState({
    imgName: (service && service.imgName) || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedService((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await handleUpdateService(service._id, updatedService);
      handleClose();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h6">Edit Service</Typography>
        <TextField
          fullWidth
          type="text"
          label="Image Name"
          name="imgName"
          value={updatedService.imgName}
          onChange={handleChange}
          sx={{ marginBottom: 1.5 }}
        />
        <Button variant="outlined" onClick={handleUpdate} sx={{ marginRight: 1 }}>
          Save
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default AllServices;
