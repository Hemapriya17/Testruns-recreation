import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import { Button, IconButton, Typography, Grid } from "@mui/material";
import { FaFilter } from "react-icons/fa";
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    backgroundColor: 'transparent',
  },
  [theme.breakpoints.up('md')]: {
    backgroundColor: 'transparent',
  },
  [theme.breakpoints.up('lg')]: {
    backgroundColor: 'transparent',
  },
}));

const columns = [
  { field: "id", headerClassName: "super-app-theme--header", headerName: "Run ID", width: 150 },
  { field: "procedureName", headerClassName: "super-app-theme--header", headerName: "Procedure name", width: 200 },
  { field: "departemntName", headerClassName: "super-app-theme--header", headerName: "Department", width: 150 },
  { field: "labName", headerClassName: "super-app-theme--header", headerName: "Laboratory", width: 150 },
  { field: "createdOn", headerClassName: "super-app-theme--header", headerName: "Created On", width: 150 },
  { field: "due", headerClassName: "super-app-theme--header", headerName: "Due Date", width: 150 },
  { field: "status", headerClassName: "super-app-theme--header", headerName: "Status", width: 150 },
  { field: "assignedby", headerClassName: "super-app-theme--header", headerName: "Assigned By", width: 150 },
];

const rows = [
  { id: 1, procedureName: "Input Power", departemntName: "EEE", labName: "EEE lab1", createdOn: "07/16/2024", due: "07/26/2024", status: "Started", assignedby: "Hema Learny" },
  { id: 2, procedureName: "DC Shunt Motor", departemntName: "EEE", labName: "EEE lab1", createdOn: "07/16/2024", due: "07/26/2024", status: "Started", assignedby: "Hema Learny" },
  { id: 3, procedureName: "DC Compound Motor", departemntName: "EEE", labName: "EEE lab1", createdOn: "07/16/2024", due: "07/26/2024", status: "Started", assignedby: "Hema Learny" },
  { id: 4, procedureName: "EDTA_Water", departemntName: "CSE", labName: "CSE lab1", createdOn: "07/16/2024", due: "07/26/2024", status: "Started", assignedby: "Hema Learny" },
  { id: 5, procedureName: "DC Series Motor", departemntName: "EEE", labName: "EEE lab1", createdOn: "07/16/2024", due: "07/26/2024", status: "Started", assignedby: "Hema Learny" },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '80%',
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Runs() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Root>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h6">Runs</Typography>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button onClick={handleOpen} variant="contained">
            + Create Run
          </Button>
        </Grid>
        <Grid item xs={12} md={2}>
          <IconButton>
            <FaFilter />
          </IconButton>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
      <Box sx={{ height: 700, width: "100%", mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          // autoHeight
        />
      </Box>
    </Root>
  );
}
