import { Box, Button, Card, CardActions, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import toast from 'react-hot-toast';
import Loader from '../Components/Loader';

const Location = () => {
  const [locationForm, setLocationForm] = useState({ label: '', icon: '' });
  const [displayLocations, setDisplayLocations] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editLocation, setEditLocation] = useState({ _id: '', label: '', icon: '' });
  const [loading,setLoading]=useState(true);
  const handleAddLocation = async () => {
    try {
      const { data } = await axios.post('http://localhost:4000/api/v1/admin/location', locationForm,{withCredentials:true});
      toast.success(data.message);
      fetchLocations();
      setLocationForm({ label: '', icon: '' });
    } catch (error) {
      toast.error("Something went wrong! Try again");
    }
  };

  const fetchLocations = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/v1/location');
      setDisplayLocations(data.allLocations);
    } catch (error) {
      console.log(error.response);
    }finally{
      setLoading(false)
    }
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      const { data } = await axios.delete(`http://localhost:4000/api/v1/admin/location/${locationId}`,{withCredentials:true});
      console.log(data);
      toast.success("Location deleted successfully...");
      fetchLocations();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Try again");
    }
  };

  const handleOpenEditModal = (location) => {
    setEditLocation(location);
    setOpenModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenModal(false);
  };

  const handleSaveEditLocation = async () => {
    try {
      const { data } = await axios.put(`http://localhost:4000/api/v1/admin/location/${editLocation._id}`, editLocation,{withCredentials:true});
      console.log(data);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Try again");
    } finally {
      fetchLocations();
      setOpenModal(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);
 if(loading) return <Loader/>
  return (
    <Container>
      <Grid container spacing={2} justifyContent="center" marginTop={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
            <Grid item xs={12} mt={4} mb={2}>
                <Typography variant='h4' textAlign={'center'} mt={1}>Add location</Typography>
                <Divider/>
            </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Label"
                    variant="outlined"
                    fullWidth
                    name="label"
                    value={locationForm.label}
                    onChange={(e) => setLocationForm({ ...locationForm, label: e.target.value })}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Icon"
                    variant="outlined"
                    fullWidth
                    name="icon"
                    value={locationForm.icon}
                    onChange={(e) => setLocationForm({ ...locationForm, icon: e.target.value })}
                    margin="dense"
                  />
                </Grid>
              </Grid>
              <Button variant="contained" color="primary" onClick={handleAddLocation} style={{ marginTop: '1rem' }}>
                Add Location
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography  variant='h4' textAlign={'center'} mt={3}>All Locations</Typography>
      <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center" marginTop={5}>
        {displayLocations.map((location, index) => (
          <Card key={index} sx={{ minWidth: 275, margin: 1 }}>
            <CardContent>
              <Typography variant="h5" component="div" textAlign={'center'}>
                {location.label}
              </Typography>
              <img src={`/ImagesFiles/Location/${location.icon}.jpg`} alt='Location' style={{height:'200px',width:'200px',display:'block',margin:'auto'}}/>
            </CardContent>
            <CardActions style={{justifyContent:'space-between'}}>
            <IconButton onClick={() => handleOpenEditModal(location)} aria-label="edit" size="small" title="Edit">
                      <EditIcon style={{transform:'scale(1.2)',color:'grey'}}/>
                    </IconButton>
                    <IconButton onClick={() => handleDeleteLocation(location._id)} aria-label="delete" title="Delete">
                      <DeleteIcon style={{transform:'scale(1.2)',color:'red'}} />
                    </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
      <Dialog open={openModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Location</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the details for the location.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Label"
            fullWidth
            value={editLocation.label}
            onChange={(e) => setEditLocation({ ...editLocation, label: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Icon"
            fullWidth
            value={editLocation.icon}
            onChange={(e) => setEditLocation({ ...editLocation, icon: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveEditLocation} color="primary">
            Save
          </Button>
          <Button onClick={handleCloseEditModal} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Location;
