import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Typography,
  Box,
  TextField,
  Modal,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    procedureName: "",
    createdOn: "",
    department: "Dept 1",
    laboratory: "Lab 1",
    userId: "",
  });
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [userId, setUserId] = useState("669b86da74088e9469ed9ac7");

  useEffect(() => {
    axios
      .get("https://testruns-backend.onrender.com/api/procedures")
      .then((response) => {
        const proceduresWithId = response.data.map((procedure) => ({
          ...procedure,
          id: procedure._id,
        }));
        setRows(proceduresWithId);
      })
      .catch((error) => console.error("Error fetching procedures:", error));
  }, []);

  const handleOpen = (procedure = null) => {
    if (procedure) {
      setEditMode(true);
      setFormData({
        procedureName: procedure.procedureName,
        createdOn: procedure.createdOn,
        department: procedure.department,
        laboratory: procedure.laboratory,
        userId: procedure.userId,
      });
    } else {
      setEditMode(false);
      setFormData({
        procedureName: "",
        createdOn: new Date().toISOString().split("T")[0],
        department: "Dept 1",
        laboratory: "Lab 1",
        userId,
      });
      setOpen(true);
      return;
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleDeleteOpen = (procedure) => {
    setSelectedProcedure(procedure);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => setDeleteOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    if (editMode) {
      axios
        .put(`https://testruns-backend.onrender.com/api/procedures/${formData.id}`, formData)
        .then((response) => {
          const updatedProcedure = { ...response.data, id: response.data._id };
          setRows(
            rows.map((row) =>
              row.id === updatedProcedure.id ? updatedProcedure : row
            )
          );
          navigate("/newprocedure", { state: { procedure: updatedProcedure } });
          handleClose();
        })
        .catch((error) => console.error("Error updating procedure:", error));
    } else {
      axios
        .post("https://testruns-backend.onrender.com/api/procedures", formData)
        .then((response) => {
          const newProcedure = { ...response.data, id: response.data._id };
          setRows((prevRows) => [newProcedure, ...prevRows]); // Add the new procedure at the beginning of the rows array
          navigate("/newprocedure", { state: { procedure: newProcedure } });
          handleClose();
        })
        .catch((error) => {
          console.error("Error creating procedure:", error);
          alert("Failed to create procedure. Check the console for details.");
        });
    }
  };
  
  

  const handleDelete = () => {
    if (selectedProcedure) {
      axios
        .delete(`https://testruns-backend.onrender.com/api/procedures/${selectedProcedure.id}`)
        .then(() => {
          setRows(rows.filter((row) => row.id !== selectedProcedure.id));
          handleDeleteClose();
        })
        .catch((error) => console.error("Error deleting procedure:", error));
    }
  };

  const columns = [
    { field: "id", headerName: "Procedure ID", width: 250 },
    { field: "procedureName", headerName: "Procedure Name", width: 250 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "laboratory", headerName: "Laboratory", width: 100 },
    { field: "createdOn", headerName: "Created on", width: 150 },
    { field: "createdBy", headerName: "Created by", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
         
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleOpen(params.row);
            }}
          >
            <EditIcon color="primary" />
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteOpen(params.row);
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <DeleteForeverIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: "96%" }}>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Procedures
        </Typography>
        <Button onClick={() => handleOpen()} variant="contained">
          Create Procedure
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        onRowClick={(params) =>
          navigate("/newprocedure", { state: { procedure: params.row } })
        }
      />
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editMode ? "Edit Procedure" : "Create Procedure"}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="procedureName"
                label="Procedure Name"
                variant="outlined"
                fullWidth
                value={formData.procedureName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="createdOn"
                label="Created on"
                variant="outlined"
                fullWidth
                value={formData.createdOn}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="department"
                label="Department"
                variant="outlined"
                fullWidth
                value={formData.department}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="laboratory"
                label="Laboratory"
                variant="outlined"
                fullWidth
                value={formData.laboratory}
                disabled
              />
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editMode ? "Update" : "Create"}
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              color="secondary"
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={deleteOpen} onClose={handleDeleteClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            Confirm Delete
          </Typography>
          <Typography gutterBottom>
            Are you sure you want to delete this Procedure?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleDeleteClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
