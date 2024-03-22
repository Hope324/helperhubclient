
import { Button, Card, CardContent, Divider, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Container } from '@mui/system'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AdditionalDetailsCard from './AdditionalDetailsCard';
import toast from 'react-hot-toast';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Loader from '../Components/Loader';

const AdditionalInfo = () => {
  const [title, setTitle] = useState('');
  const [fetchTitles, setFetchTitles] = useState([]); 
  const [formData, setFormData] = useState({ heading: '', subHeading: '', data: [] });
  const [option, setOption] = useState('');
  const [optionsArr, setOptionsArr] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [enteredTitle, setEnteredTitle] = useState('');
  const [loading,setLoading]=useState(true);
  const [getAllAdditionalDetails,setGetAllAdditionalDetails]=useState([]);
  
  const fetchTitlesFromDatabase = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/v1/allServices');
      setFetchTitles(data.allServices);
    } catch (error) {
      console.error('Error fetching titles:', error.message);
    }
  }

  const handleAddOption = () => {
    setOptionsArr([...optionsArr, option]);
    setOption('');
  }

  const handleAddFormData = () => {
    const newSubsection = {
      heading: formData.heading,
      subHeading: formData.subHeading,
      data: optionsArr.map(option => ({ label: option }))
    };
    setSubsections([...subsections, newSubsection]);
    if(Object.values(newSubsection).includes('')){
      toast.error("Please fill up all details");
    }
    else{
    toast.success("Details added successfully...");
    }
    setFormData({ heading: '', subHeading: '', data: [] });
    setOption('');
    setOptionsArr([]);
  }

  const addAdditionalDetails = async () => {
    try {
         await axios.post('http://localhost:4000/api/v1/admin/additionalDetails', {
        title,
        subsections
      },
      {withCredentials:true});
      toast.success("Additional details added successfully...");
      fetchAllAdditionalDetails();
      setEnteredTitle(title); 
    
    } catch (error) {
      toast.error("Something went wrong! Try again");
      console.log(error.response);
    }
  }

  const fetchAllAdditionalDetails = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/v1/additionalDetails');
      setGetAllAdditionalDetails(data.allAdditionalInfo);
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false);
    }
  }

  const handleResetOptions = () => {
    setOptionsArr([]);
  };

 

  useEffect(() => {
    fetchTitlesFromDatabase();
    fetchAllAdditionalDetails();
  }, [])
  
  if(loading) return <Loader/>;

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
            <Grid item xs={12} mt={4} mb={2}>
          <Typography variant='h4' textAlign={'center'} mt={1}>Add service with additional details</Typography>
          <Divider/>
        </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} >
                  <Select
                    labelId="title-label"
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      setEnteredTitle(e.target.value);
                    }}
                    label="Title"
                    fullWidth
                    margin="dense"
                    name="title"
                    sx={{mt:'7.5px'}}
                    
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
                    label="Heading"
                    variant="outlined"
                    fullWidth
                    name="heading"
                    value={formData.heading}
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Subheading"
                    variant="outlined"
                    fullWidth
                    name="subHeading"
                    value={formData.subHeading}
                    
                    onChange={(e) => setFormData({ ...formData, subHeading: e.target.value })}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12}>
                  {optionsArr && optionsArr.length !==0 && 
                  optionsArr.map((opt, index) => (
                    <TextField
                      key={index}
                      label={`Option ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      name={`option-${index}`}
                      value={opt}
                      disabled
                      margin="dense"
                    />
                  ))}
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Option"
                    variant="outlined"
                    fullWidth
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddOption}
                    startIcon={<AddCircleOutlineIcon />}
                    title="Add"
                    disabled={!option}
                    style={{ marginTop: '1rem', marginLeft: '1rem' }}
                  >
                    option
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleResetOptions}
                    style={{ marginTop: '1rem', marginLeft: '1rem' }}
                  >
                    Reset options
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" color="primary" onClick={handleAddFormData}>
                    Add details
                  </Button>
                </Grid>
                
              </Grid>
              <Grid item xs={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addAdditionalDetails}
                    style={{ marginTop: '1rem' }}
                  >
                    Save
                  </Button>
                </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={12} mt={4} mb={2}>
          <Typography variant='h4' textAlign={'center'} mb={1}>All services additional details</Typography>
          <Divider/>
        </Grid>
      <Grid container spacing={10} sx={{ justifyContent: 'center', rowGap: '20px',height:'auto' }}>
          {
            getAllAdditionalDetails && getAllAdditionalDetails.length !==0 &&
            getAllAdditionalDetails.map((item)=>(
              <AdditionalDetailsCard key={item._id} details={item}
               fetchAllAdditionalDetails={fetchAllAdditionalDetails}
               enteredTitle={enteredTitle} />
            ))
          }
        </Grid>
    </Container>
  )
}

export default AdditionalInfo;
