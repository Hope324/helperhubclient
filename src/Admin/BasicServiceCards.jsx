import { Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const BasicServiceCards = ({baseServiceInfo,delBaseServiceInfo}) => {
    const navigate=useNavigate();
    const handleCardView = () => {
        navigate(`/admin/serviceDetails/basicService/${baseServiceInfo._id}`, { state: { baseServiceInfo }});
      }
  return (
    <Grid item key={baseServiceInfo._id} xs={12} md={4} style={{height:'100%'}}>
        <Card>
            <CardMedia
              component="img"
              alt="Basic Service"
              height="300px"
              width="100%"
              border="2px solid black"
              image={`/ImagesFiles/${baseServiceInfo?.title}/BasicService/${baseServiceInfo?.servicesInfo?.serviceData?.imgName}.jpg`}
            />
            <CardContent style={{height:'250px'}}>
              <Typography variant="h6"><strong>Header: </strong>{baseServiceInfo?.servicesInfo?.serviceData?.header}</Typography>
              <Typography variant="body2"><strong>Price: </strong>{baseServiceInfo?.servicesInfo?.serviceData?.price}</Typography>
              <Typography variant="body2"><strong>Description: </strong>{baseServiceInfo?.servicesInfo?.serviceData?.description}</Typography>
              <Typography variant="body2"><strong>Details: </strong>{baseServiceInfo?.servicesInfo?.serviceData?.description2}</Typography>  
            
            </CardContent>
            <CardActions style={{justifyContent:'space-between'}}>
            
                <IconButton onClick={handleCardView} aria-label="view" size="small" title="View">
            <VisibilityIcon style={{transform:'scale(1.2)',color:'green'}} />
          </IconButton>

                <IconButton onClick={()=>delBaseServiceInfo()} aria-label="delete" size="small" title="Delete">
                  <DeleteIcon style={{transform:'scale(1.2)',color:'red'}}/>
                </IconButton>
            </CardActions>
          </Card>
        
    </Grid>
  )
}

export default BasicServiceCards
