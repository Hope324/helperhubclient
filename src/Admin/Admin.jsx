
import React, { useState, useEffect } from 'react';
import { Typography, Container, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Modal, Box, Button, MenuItem, Select, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import Loader from '../Components/Loader';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/admin/users', { withCredentials: true });
      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/admin/user/${id}`, { withCredentials: true });
      fetchAllUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleUpdateRole = async (role) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/admin/user/${selectedUser._id}`, { role }, { withCredentials: true });
      fetchAllUsers();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };
  if(loading) return <Loader/>
  return (
    <Container>
      <Grid container margin={2}>
        <Grid item xs={12} md={10}>
          <div>
            <Container>
              <Typography variant="h3" style={{ marginTop: '20px' }} sx={{ fontWeight: 'bold' }}>All Users</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 22 }}>Name</Typography>
                      </TableCell>
                      <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 22 }}>Email</Typography>
                      </TableCell>
                      <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 22 }}>Role</Typography>
                      </TableCell>
                      <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 22 }}>Actions</Typography>
                      </TableCell>
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          textDecoration: 'none',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#1976D2',
                            '& *': {
                              color: 'white',
                            },
                          },
                        }}
                      >
                        <TableCell>
                          <Link to={`/admin/user-details/user/${user._id}`}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16 }}>{user.username}</Typography>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link to={`/admin/user-details/user/${user._id}`}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16 }}>{user.email}</Typography>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link to={`/admin/user-details/user/${user._id}`}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16 }}>{user.role}</Typography>
                          </Link>
                        </TableCell>
                        
                        <TableCell>
                          <IconButton onClick={() => handleDeleteUser(user._id)}>
                            <DeleteIcon />
                          </IconButton>
                          <Button onClick={() => handleOpenModal(user)}>Edit Role</Button>
                        </TableCell>
                        
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
            <Modal open={openModal} onClose={handleCloseModal}>
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
                <Typography variant="h6">Update Role</Typography>
                <Typography>Name: {selectedUser?.username}</Typography>
                <Select
                  label="Role"
                  value={selectedUser?.role || ''}
                  onChange={(e) => handleUpdateRole(e.target.value)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
                <Button onClick={handleCloseModal}>Cancel</Button>
              </Box>
            </Modal>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;

