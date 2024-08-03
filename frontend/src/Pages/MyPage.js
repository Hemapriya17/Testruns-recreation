import React from 'react'

const MyPage = () => {
  return (
    <div>MyPage</div>
  )
}

export default MyPage




// // src/components/Runs.js
// import React, { useState, useEffect } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { Button, Typography, Box, Modal, IconButton, Grid } from '@mui/material';
// import axios from 'axios';
// import DeleteIcon from '@mui/icons-material/Delete';

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

// export default function Runs() {
//   const [open, setOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [rows, setRows] = useState([]);
//   const [selectedRunId, setSelectedRunId] = useState(null);

//   const columns = [
//     { field: "procedureName", headerName: "Procedure Name", width: 200 },
//     { field: "procedureContent", headerName: "Procedure Content", width: 250 },
//     { field: "department", headerName: "Department", width: 150 },
//     { field: "lab", headerName: "Lab", width: 150 },
//     { field: "objective", headerName: "Test Objective", width: 200 },
//     { field: "dueDate", headerName: "Due Date", width: 150 },
//     { field: "createdOn", headerName: "Created On", width: 150, 
//       valueFormatter: (params) => {
//         const date = new Date(params.value);
//         return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
//       }
//     },
//     { 
//       field: "actions", 
//       headerName: "Actions", 
//       width: 100, 
//       renderCell: (params) => (
//         <IconButton onClick={(event) => handleDeleteIconClick(event, params.row.id)}>
//           <DeleteIcon />
//         </IconButton>
//       ) 
//     }
//   ];

//   useEffect(() => {
//     axios.get('http://localhost:8000/api/runs')
//       .then(response => {
//         // Ensure the data is properly formatted
//         const sortedRuns = response.data
//           .map(run => ({ ...run, id: run._id }))
//           .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
//         setRows(sortedRuns);
//       })
//       .catch(error => console.error(error));
//   }, []);

//   const handleOpen = (run) => {
//     // Handle opening of the modal
//     // Add your code here
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleDeleteOpen = (runId) => {
//     setSelectedRunId(runId);
//     setDeleteOpen(true);
//   };

//   const handleDeleteClose = () => setDeleteOpen(false);

//   const handleDelete = () => {
//     axios.delete(`http://localhost:8000/api/runs/${selectedRunId}`)
//       .then(() => {
//         setRows(rows.filter(row => row.id !== selectedRunId));
//         handleDeleteClose();
//       })
//       .catch(error => console.error(error));
//   };

//   const handleDeleteIconClick = (event, runId) => {
//     event.stopPropagation();
//     handleDeleteOpen(runId);
//   };

//   return (
//     <div style={{ height: 600, width: '98%' }}>
//       <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
//         <Typography variant="h6" noWrap component="div">
//           Runs Management
//         </Typography>
//         <Button onClick={() => handleOpen()} variant='contained'>Add Run</Button>
//       </Box>
//       <Modal open={open} onClose={handleClose}>
//         <Box sx={style}>
//           {/* Modal content for add/edit run */}
//           <Grid container spacing={2}>
//             {/* Add your form fields here */}
//           </Grid>
//         </Box>
//       </Modal>
//       <Modal open={deleteOpen} onClose={handleDeleteClose}>
//         <Box sx={style}>
//           <Typography variant="h6">Are you sure you want to delete the run?</Typography>
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//             <Button onClick={handleDeleteClose} sx={{ mr: 1 }}>Cancel</Button>
//             <Button onClick={handleDelete} variant='contained'>Delete</Button>
//           </Box>
//         </Box>
//       </Modal>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: { page: 0, pageSize: 10 },
//           },
//         }}
//         pageSizeOptions={[5, 10]}
//         checkboxSelection
//         onRowClick={(params) => handleOpen(params.row)}
//       />
//     </div>
//   );
// }
