import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, Box, TextField, MenuItem, Modal, IconButton, Grid } from '@mui/material';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const statuses = [
  { value: 'Created', label: 'Created' },
  { value: 'Started', label: 'Started' },
  { value: 'Stopped', label: 'Stopped' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Submitted', label: 'Submitted' },
];

export default function Runs() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [formData, setFormData] = useState({
    procedureID: '',
    procedureName: '',
    department: '',
    lab: '',
    dueDate: '',
    createdOn: '',
    assignedBy: '',
    objective: '',
    status: 'Created'
  });

  const columns = [
    { field: "id", headerName: "Runs ID", width: 150 },
    { field: "procedureName", headerName: "Procedure Name", width: 180 },
    { field: "objective", headerName: "Objective", width: 200 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "lab", headerName: "Lab", width: 150 },
    { field: "createdOn", headerName: "Created On", width: 150 },
    { field: "dueDate", headerName: "Due Date", width: 150 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "assignedBy", headerName: "Assigned By", width: 180 },
    { 
      field: "actions", 
      headerName: "Actions", 
      width: 100, 
      renderCell: (params) => (
        <IconButton
          onClick={(event) => handleDeleteIconClick(event, params.row.id)}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <DeleteForeverIcon color='error' />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    fetchRuns();
    fetchProcedures();
  }, []);

  const fetchRuns = () => {
    axios.get('http://localhost:8000/api/runs')
      .then(response => {
        const runsWithId = response.data.map(run => ({ ...run, id: run._id }));
        const sortedRuns = runsWithId.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        setRows(sortedRuns);
      })
      .catch(error => console.error(error));
  };

  const fetchProcedures = () => {
    axios.get('http://localhost:8000/api/procedures')
      .then(response => {
        setProcedures(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleOpen = (run) => {
    if (run) {
      setEditMode(true);
      setSelectedRunId(run.id);
      setFormData({
        procedureID: run.procedureID || '',
        procedureName: run.procedureName || '',
        department: run.department || '',
        lab: run.lab || '',
        dueDate: run.dueDate || '',
        createdOn: run.createdOn || '',
        assignedBy: run.assignedBy || '',
        objective: run.objective || '',
        status: run.status || 'Created'
      });
    } else {
      setEditMode(false);
      setFormData({
        procedureID: '',
        procedureName: '',
        department: '',
        lab: '',
        dueDate: '',
        createdOn: new Date().toISOString().split('T')[0],
        assignedBy: currentUser ? currentUser.displayName || 'Unknown' : 'Unknown',
        objective: '',
        status: 'Created'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  const handleDeleteOpen = (runId) => {
    setSelectedRunId(runId);
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

  const handleProcedureChange = (e) => {
    const selectedProcedure = procedures.find(proc => proc.procedureName === e.target.value);
    if (selectedProcedure) {
      setFormData({
        ...formData,
        procedureName: selectedProcedure.procedureName,
        department: selectedProcedure.department,
        lab: selectedProcedure.laboratory,
        procedureID: selectedProcedure._id
      });
    } else {
      setFormData({
        ...formData,
        procedureName: '',
        department: '',
        lab: '',
        procedureID: ''
      });
    }
  };

  const handleSubmit = () => {
    if (editMode) {
      // Update an existing run
      axios.put(`http://localhost:8000/api/runs/${selectedRunId}`, formData)
        .then(response => {
          fetchRuns(); // Refresh the list of runs
          handleClose(); // Close the form or modal
        })
        .catch(error => {
          console.error('Update failed:', error.response?.data || error);
        });
    } else {
      // Create a new run
      axios.post('http://localhost:8000/api/runs', {
        ...formData,
        createdOn: new Date().toISOString().split('T')[0], // Use the current date
        assignedBy: currentUser ? currentUser.displayName || 'Unknown' : 'Unknown' // Use the current user's display name
      })
      .then(response => {
        fetchRuns(); // Refresh the list of runs
        handleClose(); // Close the form or modal
        // Navigate to the new runs page with the RunsID
        navigate(`/newruns/${response.data._id}`); // Use response data to get procedureID
      })
      .catch(error => {
        console.error('Create failed:', error.response?.data || error);
      });
    }
  };
  

  const handleDelete = () => {
    axios.delete(`http://localhost:8000/api/runs/${selectedRunId}`)
      .then(() => {
        fetchRuns();
        handleDeleteClose();
      })
      .catch(error => console.error(error));
  };

  const handleDeleteIconClick = (event, runId) => {
    event.stopPropagation();
    handleDeleteOpen(runId);
  };

  const handleRowClick = (params) => {
    console.log(params);
    if (params.field !== 'actions') {
      navigate(`/newruns/${params.row._id}`);
    }
  };

  return (
    <div style={{ height: 600, width: '88%' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
        <Typography variant="h6" noWrap component="div">
          Runs
        </Typography>
        <Button onClick={() => handleOpen()} variant='contained'>Add Run</Button>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="procedureID"
                label="Procedure ID"
                value={formData.procedureID}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="procedureName"
                label="Procedure Name"
                select
                value={formData.procedureName}
                onChange={handleProcedureChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              >
                {procedures.map((proc) => (
                  <MenuItem key={proc._id} value={proc.procedureName}>
                    {proc.procedureName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="objective"
                label="Test Objective"
                value={formData.objective}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="department"
                label="Department"
                value={formData.department}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="lab"
                label="Lab"
                value={formData.lab}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="dueDate"
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="createdOn"
                label="Created On"
                type="date"
                value={formData.createdOn}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="status"
                label="Status"
                select
                value={formData.status}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              >
                {statuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="assignedBy"
                label="Assigned By"
                value={formData.assignedBy}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {editMode ? 'Save' : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal open={deleteOpen} onClose={handleDeleteClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            Confirm Delete
          </Typography>
          <Typography gutterBottom>
            Are you sure you want to delete this run?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleDeleteClose} sx={{ mr: 2 }}>Cancel</Button>
            <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
          </Box>
        </Box>
      </Modal>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
