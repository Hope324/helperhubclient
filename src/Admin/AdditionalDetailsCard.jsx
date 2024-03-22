
import { Button, Card, CardContent, Grid, IconButton, Modal, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Box } from '@mui/system';

const AdditionalDetailsCard = ({ details,fetchAllAdditionalDetails,enteredTitle}) => {
  const [openModal, setOpenModal] = useState(false);
  const [editSubsection, setEditSubsection] = useState({_id:'', heading: '', subHeading: '', data: [] });
  const [editOption, setEditOption] = useState('');
  const [editOptionsArr, setEditOptionsArr] = useState([]);

  const handleEdition = (subsection) => {
    setEditSubsection(subsection);
    setEditOptionsArr(subsection.data.map((item) => item.label));
    setOpenModal(true);
  };

  const handleAddOption = () => {
    if (editOption.trim() === '') {
      return;
    }
    setEditOptionsArr([...editOptionsArr, editOption.trim()]);
    setEditOption('');
  };

  const handleResetOptions = () => {
    setEditOptionsArr([]);
  };

  const handleSaveEdit = async () => {
    try {
      const {data} = await axios.put(
        `http://localhost:4000/api/v1/admin/additionalDetails/${details._id}/subsection/${editSubsection._id}`,
        {
          heading: editSubsection.heading,
          subHeading: editSubsection.subHeading,
          data: editOptionsArr.map((label, index) => ({ label })),
        },{withCredentials:true}
      );
  
      toast.success(data.message)
      
      fetchAllAdditionalDetails()
  
      setOpenModal(false);
    } catch (error) {
      toast.error('Something went wrong! Try again.');
    }
  };

  const deleteSubsection = async (subsectionId) => {
    try {
      const { data } = await axios.delete(`http://localhost:4000/api/v1/admin/additionalDetails/${details._id}/subsection/${subsectionId}`,
      {withCredentials:true});
      toast.success(data.message);
      fetchAllAdditionalDetails();
    } catch (error) {
      toast.error('Something went wrong! Try again.');
    }
  };
  
  return (
    <Grid item xs={12} style={{ height: '100%' }}>
      <Card
         sx={{
          backgroundColor: enteredTitle === details.title ? 'rgba(0,0,255,0.1)' : 'inherit',
          border:enteredTitle === details.title ? '3px solid black' : '',
          transition: 'background-color 0.3s, opacity 0.3s'
        }}>
        <CardContent style={{ height: 'auto' }}>
          <Typography variant="h6"><strong>Header: </strong>{details.title}</Typography>
          {details.subsections && details.subsections.length !== 0 &&
            details.subsections.map((subsection) => (
              <div key={subsection._id} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                
                <Grid container spacing={1} style={{ width: '70%' }}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1"><strong>{subsection.heading}</strong></Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1"><strong>{subsection.subHeading}</strong></Typography>
                  </Grid>
                  <Grid item container spacing={1}>
                    {subsection.data.map((option) => (
                      <Grid item key={option._id}>
                        <Button variant="outlined">{option.label}</Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                
                <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '1.5rem' }}>
                  <IconButton onClick={() => handleEdition(subsection)} aria-label="edit" size="small" title="Edit">
                      <EditIcon style={{transform:'scale(1.2)',color:'grey'}}/>
                    </IconButton>
                  <IconButton aria-label="delete" size="small" title="Delete" onClick={() => deleteSubsection(subsection._id)}>
                    <DeleteIcon style={{ color: 'red', transform: 'scale(1.5)' }} />
                  </IconButton>
                </Grid>
              </div>
            ))}
        </CardContent>
      </Card>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          bgcolor: 'white',
          boxShadow: 24,
          p: 4,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          <Typography variant="h6" id="modal-modal-title" gutterBottom>
            Edit Details
          </Typography>
          <TextField
            label="Heading"
            variant="outlined"
            fullWidth
            value={editSubsection.heading}
            onChange={(e) => setEditSubsection({...editSubsection, heading: e.target.value})}
            margin="dense"
          />
          <TextField
            label="Subheading"
            variant="outlined"
            fullWidth
            value={editSubsection.subHeading}
            onChange={(e) => setEditSubsection({...editSubsection, subHeading: e.target.value})}
            margin="dense"
          />
          <Typography variant="subtitle1" gutterBottom>
            Options:
          </Typography>
          {editOptionsArr.map((option, index) => (
            <TextField
              key={index}
              label={`Option ${index + 1}`}
              variant="outlined"
              fullWidth
              value={option}
              onChange={(e) => {
                const newOptions = [...editOptionsArr];
                newOptions[index] = e.target.value;
                setEditOptionsArr(newOptions);
              }}
              margin="dense"
            />
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <TextField
              label="New Option"
              variant="outlined"
              value={editOption}
              onChange={(e) => setEditOption(e.target.value)}
              margin="dense"
            />
            <Button variant="outlined" color="primary" onClick={handleAddOption}>
              Add Option
            </Button>
            <Button variant="outlined" color="primary" onClick={handleResetOptions}>
              Reset Options
            </Button>
          </div>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSaveEdit}
            style={{ marginTop: '1rem',marginRight:'1rem' }}
          >
            Save
          </Button>
          <Button variant="outlined"
           color="primary" 
           onClick={()=>setOpenModal(false)} 
           style={{ marginTop: '1rem' }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default AdditionalDetailsCard;

