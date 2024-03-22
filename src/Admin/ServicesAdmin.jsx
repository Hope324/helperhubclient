
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, Grid, MenuItem, Select, Typography, Divider } from '@mui/material';

import ServiceGrid from './ServiceGrid';
import toast from 'react-hot-toast';
import Loader from '../Components/Loader';

const ServicesAdmin = () => {
  const [formData, setFormData] = useState({
    imgName: '', 
    description: '',
    heading: '',
  });

  const [displayServices, setDisplayServices] = useState([]);
  const [displayTitles, setDisplayTitles] = useState([]);
  const [fetchTitle, setFetchTitle] = useState('');
  const [loading,setLoading]=useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editService, setEditService] = useState({ _id: '', imgName: '', description: '', heading: '' });

  const handleSubmit = async () => {
    try {
      
      const { data } = await axios.post('http://localhost:4000/api/v1/admin/service', {...formData,title:fetchTitle.trim()},{withCredentials:true});
      console.log(data.particularService);
      toast.success("This service is posted successfully");
      fetchServices(); 
      setFormData({imgName:'',description:'',heading:''})
      setFetchTitle('');
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Try again");

    }
  };
  const fetchTitles = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/v1/allServices');
      setDisplayTitles(data.allServices);
    } catch (error) {
      console.error('Error fetching titles:', error.message);
    }
  };
  const fetchServices = async () => {
    try {
      const { data} = await axios.get('http://localhost:4000/api/v1/service');
       setDisplayServices(data.allService);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  };
  const handleSelectChange = (event) => {
    setFetchTitle(event.target.value);
  };
  const handleDeleteService = async (serviceId) => {
    try {
      const { data } = await axios.delete(`http://localhost:4000/api/v1/admin/service/${serviceId}`,{withCredentials:true});
      console.log(data);
      fetchServices(); 
    } catch (error) {
      console.error(error);
      
    }
  };

  const handleOpenEditModal = (service) => {
    setEditService(service);
    setOpenModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenModal(false);
  };

  const handleSaveEditService = async () => {
    try {
      const { data } = await axios.put(`http://localhost:4000/api/v1/admin/service/${editService._id}`, editService,{withCredentials:true});
      console.log(data);
      fetchServices(); 
      setOpenModal(false);
      toast.success(data.message)
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Try again")
    }
  };

  useEffect(() => {
    fetchTitles();
    fetchServices();
  }, []);
  if(loading) return <Loader/>
  return (
    <>
    <Container maxWidth="sm" margin="2">
      <Card style={{ padding: '2rem', margin: '2rem', textAlign: 'center' }}>
      <Grid item xs={12} mt={4} mb={2}>
          <Typography variant='h4' textAlign={'center'} mt={1}>Add service</Typography>
          <Divider/>
        </Grid>
      <Grid item xs={6}>
                  <Select
                    labelId="title-label"
                    id="title"
                    value={fetchTitle}
                    onChange={handleSelectChange}
                    label="Title"
                    fullWidth
                    margin="dense"
                    name="title"
                  >
                    {displayTitles.map((item) => (
                      <MenuItem key={item._id} value={item.title}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
        <TextField
          label="Image Name"
          fullWidth
          margin="normal"
          value={formData.imgName}
          name="imgName"
          onChange={(e) => setFormData({ ...formData, imgName: e.target.value })}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={formData.description}
          name="description"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <TextField
          label="Heading"
          fullWidth
          margin="normal"
          value={formData.heading}
          name="title"
          onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ marginTop: '20px', backgroundColor: 'lightblue', color: 'white' }}
        >
          Save Data
        </Button>
      </Card>
      <Grid item xs={6} mt={4}>
          <Typography variant='h4' textAlign={'center'}>All Services</Typography>
      </Grid>
      <Divider height='20px'></Divider>
      <Dialog open={openModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Service</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the details for the service.
          </DialogContentText>
          
          <TextField
            margin="dense"
            label="Image Name"
            fullWidth
            value={editService.imgName}
            onChange={(e) => setEditService({ ...editService, imgName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={editService.description}
            onChange={(e) => setEditService({ ...editService, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Heading"
            fullWidth
            value={editService.heading}
            onChange={(e) => setEditService({ ...editService, heading: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEditService} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    <ServiceGrid services={displayServices} handleDelete={handleDeleteService} handleEdit={handleOpenEditModal} />
    </>
  );
};

export default ServicesAdmin;
