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

const statuses = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

const availabilities = [
  { value: 'Available', label: 'Available' },
  { value: 'In Use', label: 'In Use' },
  { value: 'Not Available', label: 'Not Available' },
];

export default function Asset() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [formData, setFormData] = useState({
    assetName: '',
    purchaseDate: '',
    guaranteeExpiryDate: '',
    institute: 'Default Institute',
    org: 'Default Org',
    dept: 'Default Dept',
    lab: 'Default Lab',
    status: 'Active',
    availability: 'Available',
  });

  const columns = [
    { field: "assetName", headerName: "Asset Name", width: 150 },
    { field: "purchaseDate", headerName: "Purchase Date", width: 150 },
    { field: "guaranteeExpiryDate", headerName: "Guarantee/Expiry Date", width: 200 },
    { field: "org", headerName: "Organisation", width: 150 },
    { field: "dept", headerName: "Department", width: 150 },
    { field: "lab", headerName: "Lab", width: 150 },
    { field: "status", headerName: "Status", width: 100 },
    { field: "availability", headerName: "Availability", width: 150 },
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
    fetchAssets();
  }, []);

  const fetchAssets = () => {
    axios.get('https://testruns-backends.vercel.app//api/assets')
      .then(response => {
        const assetsWithId = response.data.map(asset => ({ ...asset, id: asset._id }));
        setRows(assetsWithId);
        console.log('Fetched assets:', assetsWithId);
      })
      .catch(error => console.error(error));
  };

  const handleOpen = (asset) => {
    if (asset) {
      setEditMode(true);
      setSelectedAssetId(asset.id);
      setFormData({
        assetName: asset.assetName,
        purchaseDate: asset.purchaseDate,
        guaranteeExpiryDate: asset.guaranteeExpiryDate,
        institute: asset.institute,
        org: asset.org,
        dept: asset.dept,
        lab: asset.lab,
        status: asset.status,
        availability: asset.availability,
      });
    } else {
      setEditMode(false);
      setFormData({
        assetName: '',
        purchaseDate: '',
        guaranteeExpiryDate: '',
        institute: 'Default Institute',
        org: 'Default Org',
        dept: 'Default Dept',
        lab: 'Default Lab',
        status: 'Active',
        availability: 'Available',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  const handleDeleteOpen = (assetId) => {
    setSelectedAssetId(assetId);
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
    console.log("Form data before submission:", formData);

    if (editMode) {
      axios.put(`https://testruns-backends.vercel.app//api/assets/${selectedAssetId}`, formData)
        .then(response => {
          console.log('Update response:', response.data);
          fetchAssets(); 
          handleClose();
        })
        .catch(error => console.error('Update failed:', error.response?.data || error));
    } else {
      axios.post('https://testruns-backends.vercel.app//api/assets', formData)
        .then(response => {
          console.log('Create response:', response.data);
          fetchAssets(); 
          handleClose();
        })
        .catch(error => console.error('Create failed:', error.response?.data || error));
    }
  };

  const handleDelete = () => {
    axios.delete(`https://testruns-backends.vercel.app//api/assets/${selectedAssetId}`)
      .then(() => {
        fetchAssets(); 
        handleDeleteClose();
      })
      .catch(error => console.error(error));
  };

  const handleDeleteIconClick = (event, assetId) => {
    event.stopPropagation();
    handleDeleteOpen(assetId);
  };

  return (
    <div style={{ height: 600, width: '98%' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
        <Typography variant="h6" noWrap component="div">
          Asset Management
        </Typography>
        <Button onClick={() => handleOpen()} variant='contained'>Add Asset</Button>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth id="assetName" label="Asset Name" variant="outlined" onChange={handleChange} value={formData.assetName} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="purchaseDate" label="Purchase Date" variant="outlined" onChange={handleChange} value={formData.purchaseDate} type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="guaranteeExpiryDate" label="Guarantee/Expiry Date" variant="outlined" onChange={handleChange} value={formData.guaranteeExpiryDate} type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="institute" label="Institute" variant="outlined" onChange={handleChange} value={formData.institute} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="org" label="Org" variant="outlined" onChange={handleChange} value={formData.org} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="dept" label="Department" variant="outlined" onChange={handleChange} value={formData.dept} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id="lab" label="Lab" variant="outlined" onChange={handleChange} value={formData.lab} />
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth id="status" label="Status" variant="outlined" onChange={handleChange} value={formData.status}>
                {statuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth id="availability" label="Availability" variant="outlined" onChange={handleChange} value={formData.availability}>
                {availabilities.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                {editMode ? 'Update' : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal open={deleteOpen} onClose={handleDeleteClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">Are you sure you want to delete this asset?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>
            <Button variant="outlined" color="primary" onClick={handleDeleteClose}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        onRowClick={(params) => handleOpen(params.row)}
      />
    </div>
  );
}
