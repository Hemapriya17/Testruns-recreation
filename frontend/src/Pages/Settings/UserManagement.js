// src/components/UserManagement.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, Box, TextField, MenuItem, Modal, IconButton, Grid } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const roles = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Requester', label: 'Requester' },
  { value: 'Tester', label: 'Tester' },
];

export default function UserManagement() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    institute: 'Default Institute',
    org: 'Default Org',
    dept: 'Default Dept',
    lab: 'Default Lab',
    role: 'Tester'
  });

  const columns = [
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "org", headerName: "Organisation", width: 150 },
    { field: "dept", headerName: "Department", width: 150 },
    { field: "role", headerName: "Role", width: 100 },
    { field: "userStatus", headerName: "Status", width: 100 },
    { field: "addDate", headerName: "Added On", width: 150, 
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleDeleteIconClick(event, params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    axios.get('http://localhost:8080/api/users')
      .then(response => {
        const usersWithId = response.data.map(user => ({ ...user, id: user._id }));
        setRows(usersWithId);
      })
      .catch(error => console.error(error));
  }, []);

  const handleOpen = (user) => {
    if (user) {
      setEditMode(true);
      setSelectedUserId(user.id);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        institute: user.institute,
        org: user.org,
        dept: user.dept,
        lab: user.lab,
        role: user.role
      });
    } else {
      setEditMode(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        institute: 'Default Institute',
        org: 'Default Org',
        dept: 'Default Dept',
        lab: 'Default Lab',
        role: 'Tester'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  const handleDeleteOpen = (userId) => {
    setSelectedUserId(userId);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => setDeleteOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = () => {
    if (editMode) {
      axios.put(`http://localhost:8080/api/users/${selectedUserId}`, formData)
        .then(response => {
          const updatedUser = { ...response.data, id: response.data._id };
          setRows(rows.map(row => row.id === selectedUserId ? updatedUser : row));
          handleClose();
        })
        .catch(error => console.error(error));
    } else {
      axios.post('http://localhost:8080/api/users', formData)
        .then(response => {
          const newUser = { ...response.data, id: response.data._id };
          setRows([newUser, ...rows]);
          handleClose();
        })
        .catch(error => console.error(error));
    }
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:8080/api/users/${selectedUserId}`)
      .then(() => {
        setRows(rows.filter(row => row.id !== selectedUserId));
        handleDeleteClose();
      })
      .catch(error => console.error(error));
  };

  const handleDeleteIconClick = (event, userId) => {
    event.stopPropagation();
    handleDeleteOpen(userId);
  };

  return (
    <div style={{ height: 600, width: '98%' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
        <Typography variant="h6" noWrap component="div">
          User Management
        </Typography>
        <Button onClick={() => handleOpen()} variant='contained'>Add User</Button>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth id="firstName" label="First Name" variant="outlined" onChange={handleChange} value={formData.firstName} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="lastName" label="Last Name" variant="outlined" onChange={handleChange} value={formData.lastName} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="email" label="Email" variant="outlined" onChange={handleChange} value={formData.email} InputProps={{ readOnly: editMode }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="institute" label="Institute" variant="outlined" onChange={handleChange} value={formData.institute} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="org" label="Organisation" variant="outlined" onChange={handleChange} value={formData.org} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="dept" label="Department" variant="outlined" onChange={handleChange} value={formData.dept} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="lab" label="Laboratory/ies" variant="outlined" onChange={handleChange} value={formData.lab} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="role" select label="Role" value={formData.role} onChange={handleChange} variant="outlined">
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button variant='contained' onClick={handleSubmit}>{editMode ? 'Update User' : 'Create User'}</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal open={deleteOpen} onClose={handleDeleteClose}>
        <Box sx={style}>
          <Typography variant="h6">Are you sure you want to delete the user?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleDeleteClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button onClick={handleDelete} variant='contained'>Delete</Button>
          </Box>
        </Box>
      </Modal>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowClick={(params) => handleOpen(params.row)}
      />
    </div>
  );
}
