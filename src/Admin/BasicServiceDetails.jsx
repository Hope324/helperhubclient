
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Grid, Typography, Card, CardContent, CardMedia, CardActions, Checkbox, FormControlLabel, Button, TextField, TableRow, TableCell, Modal, IconButton } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Box } from '@mui/system';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const BasicServiceDetails = () => {
  const { id } = useParams();
  const { state: { baseServiceInfo } } = useLocation();
  console.log(baseServiceInfo)
  const [includeAddons,setIncludeAddons]=useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editAddOn,setEditAddOn]=useState({_id:'',header:'',imgName:'',price:'',description:''});
  const [choosenServiceData,setChoosenServiceData]=useState([]);
  const handleCheckboxChange = () => {
    setIncludeAddons(!includeAddons);
  };
  const handleAddAddon = async () => {
    try {
      const {data} = await axios.post(`http://localhost:4000/api/v1/admin/selectService/${id}`, addonFormData,{withCredentials:true});
      const { message } =data;
      toast.success(message);
      fetchChoosenService();
     
      setAddonFormData({
        header: '',
        imgName: '',
        price: '',
        description: '',
      });
    } catch (error) {
      toast.error("Something went wrong! Try again");
    }
  };
  
  const { servicesInfo,title } = baseServiceInfo;
  const { serviceData } = servicesInfo;
  const [addonFormData,setAddonFormData]=useState({header:'',imgName:'',price:'',description:''})
console.log(title)
  const handleEditAddon=(addon)=>{
    setEditAddOn(addon);
    setOpenModal(true);
  }
  const handleDeleteAddon = async (addonId) => {
    try {
      const {data}=await axios.delete(`http://localhost:4000/api/v1/admin/selectService/${id}/addOn/${addonId}`,{withCredentials:true});
      
      toast.success(data.message)
      fetchChoosenService();

    } catch (error) {
      toast.error("Something went wrong! Try again");
    }
  };
  const handleSaveEdit=async()=>{
    try {
      const {data}=await axios.put(`http://localhost:4000/api/v1/admin/selectService/${id}/addOn/${editAddOn._id}`,editAddOn,{withCredentials:true})
      toast.success(data.message);
      fetchChoosenService();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Try again");
    }finally{
      setOpenModal(false);
    }
  }
 
  const fetchChoosenService = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:4000/api/v1/admin/selectService/${id}`, { withCredentials: true });
      setChoosenServiceData(data.choosedService?.servicesInfo?.addonsData);
    } catch (error) {
      console.log(error);
    }
  }, [id]);
  useEffect(()=>{
    fetchChoosenService();
  },[fetchChoosenService])

  return (
    <Container sx={{ marginTop: 2 }}>
      <Typography variant="h1" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" gutterBottom>
        Basic Service Details:
      </Typography>
       <Grid item key={baseServiceInfo._id} xs={12} md={6} height={"100vh"}>
          <Card sx={{ width: '100%', height: '100%', borderRadius: '15px' }}>
            <CardMedia
              component="img"
              alt="Service Image"
              height="70%"
              width="100%"
              border="10px solid black"
              image={`/ImagesFiles/${title}/BasicService/${serviceData.imgName}.jpg`}
            />
            
          <CardContent sx={{height:'20%'}}>
                <Typography variant="body1" gutterBottom>
                  <strong>Price: </strong>₹{serviceData.price}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Description: </strong> {serviceData.description}
                </Typography>
                <Typography variant="body1">
                  <strong>Details:</strong> {serviceData.description2}
                </Typography>
          </CardContent>
          <CardActions style={{justifyContent:'space-between'}}>
            <FormControlLabel
                control={
                  <Checkbox
                    checked={includeAddons}
                    onChange={handleCheckboxChange}
                    name="includeAddons"
                  />
                }
                label="Include Addons"
              />
            </CardActions>
               
          </Card>
        </Grid>
        <Grid xs={12} md={6} height={"auto"}>
        {includeAddons && (
          <Grid item xs={12} style={{ marginTop: '1rem' }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Addons Form
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Header"
                      variant="outlined"
                      fullWidth
                      name="header"
                       value={addonFormData.header}
                       onChange={(e)=>setAddonFormData({...addonFormData,header:e.target.value})}
                      
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Image Name"
                      variant="outlined"
                      fullWidth
                      name="imgName"
                       value={addonFormData.imgName}
                       onChange={(e)=>setAddonFormData({...addonFormData,imgName:e.target.value})}
                      
                      margin="dense"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Price"
                      variant="outlined"
                      fullWidth
                      name="price"
                       value={addonFormData.price}
                       onChange={(e)=>setAddonFormData({...addonFormData,price:e.target.value})}
                      
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Description"
                      variant="outlined"
                      fullWidth
                      name="description"
                      value={addonFormData.description}
                      onChange={(e)=>setAddonFormData({...addonFormData,description:e.target.value})}
                      margin="dense"
                    />
                  </Grid>
                </Grid>
                <Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />} onClick={handleAddAddon} style={{ marginTop: '1rem' }}>
                  Addon
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
        </Grid>
        <Grid xs={12} md={6} height={"auto"}>
       {choosenServiceData && choosenServiceData.length !==0 && choosenServiceData.map((addon) => (
    <TableRow key={addon._id}>
    <TableCell style={{fontSize:'25px',fontWeight:'bold'}}>{addon.header}</TableCell>
    <TableCell>
      <img style={{width:'300px',height:'300px',objectFit:'cover'}} src={`/ImagesFiles/${baseServiceInfo.title}/AddOns/${addon.imgName}.jpg`} alt='Addon' />
    
    </TableCell>
    <TableCell style={{fontSize:'25px'}}><strong>₹{addon.price}</strong></TableCell>
    <TableCell style={{fontSize:'18px'}}>{addon.description}</TableCell>
    <TableCell>
      <IconButton onClick={() => handleEditAddon(addon)} aria-label="edit" size="small" title="Edit">
                  <EditIcon style={{transform:'scale(1.2)',color:'grey'}}/>
                </IconButton>
    </TableCell>
    <TableCell>
      {/* <Button
        variant="contained"
        color="secondary"
        onClick={() => handleDeleteAddon(addon._id)}
      >
        Delete
      </Button> */}
      <IconButton onClick={() => handleDeleteAddon(addon._id)} aria-label="delete" size="small" title="Delete">
                  <DeleteIcon style={{transform:'scale(1.2)',color:'red'}}/>
                </IconButton>
    </TableCell>
  </TableRow>
      
))}
</Grid>
    <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            maxHeight: '80vh',
            overflowY: 'auto', 
          }}
        >
          <Typography variant="h6" id="modal-modal-title" gutterBottom>
            Edit Subsection
          </Typography>
          <TextField
            label="Header"
            variant="outlined"
            fullWidth
            value={editAddOn.header}
            onChange={(e) => setEditAddOn({...editAddOn,header:e.target.value})}
            margin="dense"
          />
          <TextField
            label="Image Name"
            variant="outlined"
            fullWidth
            value={editAddOn.imgName}
            onChange={(e) => setEditAddOn({...editAddOn,imgName:e.target.value})}
            margin="dense"
          />
           <TextField
            label="Price"
            variant="outlined"
            fullWidth
            value={editAddOn.price}
            onChange={(e) => setEditAddOn({...editAddOn,price:e.target.value})}
            margin="dense"
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={editAddOn.description}
            onChange={(e) => setEditAddOn({...editAddOn,description:e.target.value})}
            margin="dense"
          />
          <Button variant="outlined" color="primary"  onClick={handleSaveEdit} style={{ marginTop: '1rem',marginRight:'1rem' }}>
            Save 
          </Button>
          <Button variant="outlined" color="primary" onClick={()=>setOpenModal(false)} style={{ marginTop: '1rem' }}>
            Cancel
          </Button>
        </Box>
      </Modal>     
    </Container>
  );
};

export default BasicServiceDetails;

