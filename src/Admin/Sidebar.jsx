
import React, { useState } from 'react';
import { Drawer, Button, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeOption, setActiveOption] = useState('Admin Dashboard');
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setIsOpen(true);
  };

  const handleDrawerClose = () => {
    setIsOpen(false);
  };

  const handleOptionClick = (option) => {
    setActiveOption(option);
    switch (option) {
      case 'Admin Dashboard':
        navigate('/admin');
        break;
      case 'All services':
        navigate('/admin/allServices');
        break;
      case 'Service':
        navigate('/admin/service');
        break;
      case 'Locations':
        navigate('/admin/locations');
        break;
      case 'Service Details':
        navigate('/admin/serviceDetails');
        break;
      case 'Additional Details':
        navigate('/admin/additionalDetails');
        break;
      default:
        navigate('/');
        break;
    }
  };
  
  return (
    <>
      <Drawer
        open={isOpen}
        anchor="left"
        onClose={handleDrawerClose}
        style={{ display: isOpen ? 'block' : 'none', width: drawerWidth,fontFamily:"Poppins" }}
      >
        <div style={{ width: drawerWidth }}>
          <Button onClick={handleDrawerClose}>&times; Close</Button>
          <List sx={{cursor:'pointer'}}>
            <ListItem onClick={() => handleOptionClick('Admin Dashboard')} style={{marginTop:'1rem', backgroundColor: activeOption === 'Admin Dashboard' ? 'blue' : 'inherit', color: activeOption === 'Admin Dashboard' ? 'white' : 'inherit' }}>
              <ListItemText primary="Admin Dashboard" />
            </ListItem>
            <ListItem onClick={() => handleOptionClick('All services')} style={{ backgroundColor: activeOption === 'All services' ? 'blue' : 'inherit', color: activeOption === 'All services' ? 'white' : 'inherit' }}>
              <ListItemText primary="All services" />
            </ListItem>
            <ListItem onClick={() => handleOptionClick('Service')} style={{ backgroundColor: activeOption === 'Service' ? 'blue' : 'inherit', color: activeOption === 'Service' ? 'white' : 'inherit' }}>
              <ListItemText primary="Service" />
            </ListItem>
            <ListItem onClick={() => handleOptionClick('Locations')} style={{ backgroundColor: activeOption === 'Locations' ? 'blue' : 'inherit', color: activeOption === 'Locations' ? 'white' : 'inherit' }}>
              <ListItemText primary="Locations" />
            </ListItem>
            <ListItem onClick={() => handleOptionClick('Service Details')} style={{ backgroundColor: activeOption === 'Service Details' ? 'blue' : 'inherit', color: activeOption === 'Service Details' ? 'white' : 'inherit' }}>
              <ListItemText primary="Service Details" />
            </ListItem>
            <ListItem onClick={() => handleOptionClick('Additional Details')} style={{ backgroundColor: activeOption === 'Additional Details' ? 'blue' : 'inherit', color: activeOption === 'Additional Details' ? 'white' : 'inherit' }}>
              <ListItemText primary="Additional Details" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <div style={{ marginLeft: isOpen ? drawerWidth : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '10px' }}>
          <Button onClick={handleDrawerOpen}>
            <MenuIcon fontSize="large" />
          </Button>
        </div>
        
      </div>
    </>
  );
};

export default Sidebar;

