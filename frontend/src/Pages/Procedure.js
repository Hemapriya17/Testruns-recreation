import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, Box, TextField, Modal, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Chatbot from './Chatbot';  

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

export default function Procedure() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [formData, setFormData] = useState({
    procedureID: '',
    procedureName: '',
    createdOn: '',
    department: 'Dept 1',
    laboratory: 'Lab 1',
    userId: '' 
  });
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [userId, setUserId] = useState('669b86da74088e9469ed9ac7'); 

  useEffect(() => {
    axios.get('http://localhost:8080/api/procedures')
      .then(response => {
        const proceduresWithId = response.data.map(procedure => ({ ...procedure, id: procedure._id }));
        setRows(proceduresWithId);
      })
      .catch(error => console.error('Error fetching procedures:', error));
  }, []);

  const handleOpen = (procedure = null) => {
    if (procedure) {
      setEditMode(true);
      setFormData({
        procedureID: procedure.procedureID,
        procedureName: procedure.procedureName,
        createdOn: procedure.createdOn,
        department: procedure.department,
        laboratory: procedure.laboratory,
        userId: procedure.userId,
      });
    } else {
      setEditMode(false);
      axios.get('http://localhost:8080/api/procedures/nextID')
        .then(response => {
          setFormData({
            procedureID: response.data.nextID,
            procedureName: '',
            createdOn: new Date().toISOString().split('T')[0], // Set to today's date in YYYY-MM-DD format
            department: 'Dept 1',
            laboratory: 'Lab 1',
            userId // Ensure userId is set
          });
          setOpen(true); // Open the modal only after setting the formData
        })
        .catch(error => console.error('Error fetching next procedure ID:', error));
      return; // Exit the function early to avoid opening the modal before setting formData
    }
    setOpen(true);
  };
  
  const handleRowClick = (params) => {
    if (!params.field || params.field !== 'action') {
      navigate("/newprocedure", { state: { procedure: params.row } });
    }
  };
  

  const handleClose = () => setOpen(false);

  const handleDeleteOpen = (procedure) => {
    setSelectedProcedure(procedure);
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
      axios.put(`http://localhost:8080/api/procedures/${formData.procedureID}`, formData)
        .then(response => {
          const updatedProcedure = { ...response.data, id: response.data._id };
          setRows(rows.map(row => row.id === updatedProcedure.id ? updatedProcedure : row));
          navigate("/newprocedure", { state: { procedure: updatedProcedure } }); 
          handleClose();
        })
        .catch(error => console.error('Error updating procedure:', error));
    } else {
      axios.post('http://localhost:8080/api/procedures', formData)
        .then(response => {
          const newProcedure = { ...response.data, id: response.data._id };
          setRows([newProcedure, ...rows]);
          navigate("/newprocedure", { state: { procedure: newProcedure } }); 
          handleClose();
        })
        .catch(error => {
          console.error('Error creating procedure:', error);
          alert('Failed to create procedure. Check the console for details.');
        });
    }
  };

  const handleDelete = () => {
    if (selectedProcedure) {
      axios.delete(`http://localhost:8080/api/procedures/${selectedProcedure.id}`)
        .then(() => {
          setRows(rows.filter(row => row.id !== selectedProcedure.id));
          handleDeleteClose();
        })
        .catch(error => console.error('Error deleting procedure:', error));
    }
  };

  const columns = [
    { field: "procedureID", headerName: "Procedure ID", width: 150 },
    { field: "procedureName", headerName: "Procedure Name", width: 250 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "laboratory", headerName: "Laboratory", width: 150 },
    { field: "createdOn", headerName: "Created on", width: 150 },
    { field: "createdBy", headerName: "Created by", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
              handleOpen(params.row);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
              handleDeleteOpen(params.row);
            }}
            style={{ marginLeft: '10px' }}
          >
            Delete
          </Button>
        </>
      )
    }
  ];
  

  return (
    <>
      <Box sx={{ height: 600, width: "100%" }}>
        <Typography variant="h4" gutterBottom>Procedures</Typography>
        <Button onClick={() => handleOpen()} variant="contained" color="primary" sx={{ mb: 2 }}>Create Procedure</Button>
        <DataGrid rows={rows} columns={columns} pageSize={10} onRowClick={handleRowClick} />
      </Box>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style} component="form" noValidate autoComplete="off">
          <Typography id="modal-modal-title" variant="h6" component="h2">{editMode ? 'Edit Procedure' : 'Create Procedure'}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField id="procedureID" label="Procedure ID" value={formData.procedureID} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField id="procedureName" label="Procedure Name" value={formData.procedureName} onChange={handleChange} required fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField id="createdOn" label="Created On" value={formData.createdOn} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField id="department" label="Department" value={formData.department} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField id="laboratory" label="Laboratory" value={formData.laboratory} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>{editMode ? 'Update' : 'Create'}</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal open={deleteOpen} onClose={handleDeleteClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">Are you sure you want to delete this procedure?</Typography>
          <Button onClick={handleDelete} variant="contained" color="error" fullWidth>Delete</Button>
        </Box>
      </Modal>

      {/* Chatbot component added to the Procedure page */}
      <Chatbot />
    </>
  );
}
