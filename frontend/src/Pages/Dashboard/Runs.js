import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, Box, TextField, MenuItem, Modal, IconButton, Grid } from '@mui/material';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
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

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'green';
    case 'Started':
      return 'orange';
    case 'Created':
      return 'gray';
    case 'Stopped':
      return 'red';
    default:
      return 'black';
  }
};

export default function Runs() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [procedures, setProcedures] = useState([]);

  const columns = [
    { field: "id", headerName: "Runs ID", width: 150 },
    { field: "procedureName", headerName: "Procedure Name", width: 180 },
    { field: "objective", headerName: "Objective", width: 200 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "createdOn", headerName: "Created On", width: 150 },
    { field: "dueDate", headerName: "Due Date", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Typography style={{ color: getStatusColor(params.value) }}>
          {params.value}
        </Typography>
      ),
    },
    { field: "assignedBy", headerName: "Assigned By", width: 180 },
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

  const handleRowClick = (params) => {
    if (params.field !== 'actions') {
      navigate(`/newruns/${params.row.id}`);
    }
  };

  return (
    <div style={{ height: 310, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
