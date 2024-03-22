

import { Button, Card, CardContent, Divider, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Container } from '@mui/system'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import BasicServiceCards from './BasicServiceCards'
import Loader from '../Components/Loader'

const ServiceDetail = () => {
  const [formData,setFormData]=useState({header:'',imgName:'',price:'',description:'',description2:''})
  const [title,setTitle]=useState('');
  const [fetchTitles,setFetchTitles]=useState([]);
  const [allBasicServices,setAllBasicServices]=useState([]);
  const [loading,setLoading]=useState(true);
  const submitBasicService=async()=>{
    try {
      const {data}=await axios.post('http://localhost:4000/api/v1/admin/selectService',{
        title: title,
        servicesInfo:{
          serviceData:formData
        }
        
      },{withCredentials:true});
      toast.success(data.message);
      fetchAllBasicServices();
      setFormData({header:'',imgName:'',price:'',description:'',description2:''});
      setTitle('');
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Try again");
      if (error.response) {
        
        console.error("Server responded with error:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        
        console.error("No response received:", error.request);
      } else {
      
        console.error("Error setting up the request:", error.message);
      }
    }
  }
  const fetchTitlesFromDatabase=async()=>{
    try {
      const { data } = await axios.get('http://localhost:4000/api/v1/allServices');
      setFetchTitles(data.allServices);
    } catch (error) {
      console.error('Error fetching titles:', error.message);
    }
  }
  const fetchAllBasicServices=async()=>{
    try {
      const {data}=await axios.get('http://localhost:4000/api/v1/selectService');
      setAllBasicServices(data.showAllServices);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  }
  const deleteHandler=async(id)=>{
    try {
        const {data}=await axios.delete(`http://localhost:4000/api/v1/admin/selectService/${id}`,{withCredentials:true});
        toast.success(data.message);
        fetchAllBasicServices()
      }
      catch (error) {
        toast.error("Something went wrong! Try again");
      }
  }
  useEffect(()=>{
    fetchTitlesFromDatabase();
    fetchAllBasicServices();
  },[allBasicServices.length])

  if(loading) return <Loader/>
  return (
    <Container>

       <Grid container spacing={2}>
       
        <Grid item xs={12}>
          <Card>
            <CardContent>
            <Grid item xs={12} mt={4} mb={2}>
                <Typography variant='h4' textAlign={'center'} mt={1}>Add service with description</Typography>
                <Divider/>
             </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Select
                    labelId="title-label"
                    id="title"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    label="Title"
                    fullWidth
                    margin="dense"
                    name="title"
                    sx={{mt:"7.5px"}}
                  >
                    {fetchTitles.map((item) => (
                      <MenuItem key={item._id} value={item.title}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Header"
                    variant="outlined"
                    fullWidth
                    name="header"
                    value={formData.header}
                    onChange={(e)=>setFormData({...formData,header:e.target.value})}
                    margin="dense"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Image Name"
                    variant="outlined"
                    fullWidth
                    name="imgName"
                    value={formData.imgName}
                    onChange={(e)=>setFormData({...formData,imgName:e.target.value})}
                    
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Price"
                    variant="outlined"
                    fullWidth
                    name="price"
                    value={formData.price}
                    onChange={(e)=>setFormData({...formData,price:e.target.value})}
                    
                    margin="dense"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    name="description"
                    value={formData.description}
                    onChange={(e)=>setFormData({...formData,description:e.target.value})}
                    
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Description2"
                    variant="outlined"
                    fullWidth
                    name="description2"
                    value={formData.description2}
                    onChange={(e)=>setFormData({...formData,description2:e.target.value})}
                    
                    margin="dense"
                  />
                </Grid>
              </Grid>
              <Button variant="contained" color="primary" onClick={submitBasicService} style={{ marginTop: '1rem' }}>
                Add Service
              </Button>
              
            </CardContent>
          </Card>
        </Grid>
        </Grid>
        <Grid item xs={12} mt={4} mb={2}>
          <Typography variant='h4' textAlign={'center'} mt={1}>All services with description</Typography>
          <Divider/>
        </Grid>
        
        <Grid container spacing={10} sx={{ justifyContent: 'center', rowGap: '20px',height:'auto' }}>
          {
            allBasicServices && allBasicServices.length !==0 &&
            allBasicServices.map((item)=>(
              <BasicServiceCards key={item._id} baseServiceInfo={item} delBaseServiceInfo={()=>deleteHandler(item._id)} />
            ))
          }
        </Grid>
    </Container>
  )
}

export default ServiceDetail




