import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Box,
  Tabs,
  Tab,
  Button,
  Snackbar,
  Alert
} from "@mui/material";
import ChartRuns from "./ChartRuns";
import Result from "./Result";
import Remarks from "./Remarks";

const NewRuns = () => {
  const { procedureID } = useParams();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState("1");
  const [tabsEnabled, setTabsEnabled] = useState(false);
  const [startButtonDisabled, setStartButtonDisabled] = useState(false);
  const [stopButtonDisabled, setStopButtonDisabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const response = await axios.get(`/api/runs/${procedureID}`);
        const fetchedRun = response.data;
        setRun(fetchedRun);
        if (fetchedRun.status === "Started") {
          setStartButtonDisabled(true);
          setStopButtonDisabled(false);
          setTabsEnabled(true);
        } else if (fetchedRun.status === "Stopped") {
          setStartButtonDisabled(true);
          setStopButtonDisabled(true);
          setTabsEnabled(true);
        }
      } catch (error) {
        console.error("Error fetching run:", error);
        setError("Failed to load run details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRun();
  }, [procedureID]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const updateRunStatus = async (status, successMessage) => {
    try {
      const response = await axios.put(`/api/runs/${procedureID}`, { status });
      setRun((prevRun) => ({ ...prevRun, status: response.data.status }));
      setSnackbarMessage(successMessage);
      setSnackbarOpen(true);
      if (status === "Started") {
        setStartButtonDisabled(true);
        setStopButtonDisabled(false);
        setTabsEnabled(true);
      } else if (status === "Stopped") {
        setStartButtonDisabled(true);
        setStopButtonDisabled(true);
        setTabsEnabled(false);
      }
    } catch (error) {
      console.error("Error updating run status:", error);
      setError("Failed to update run status.");
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleStart = () => {
    updateRunStatus("Started", "Run has been started");
  };

  const handleStop = () => {
    updateRunStatus("Stopped", "Run has been stopped");
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {run.procedureName}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStart}
          disabled={startButtonDisabled}
          sx={{ mr: 1 }}
        >
          Start
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleStop}
          disabled={stopButtonDisabled}
        >
          Stop
        </Button>
      </Box>
      <Typography variant="body1">{run.objective}</Typography>
      {run ? (
        <Paper style={{ padding: "15px" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="run details tabs"
            >
              <Tab label="Procedure" value="1" disabled={!tabsEnabled} />
              <Tab label="Charts" value="2" disabled={!tabsEnabled} />
              <Tab label="Results" value="3" disabled={!tabsEnabled} />
              <Tab label="Remarks" value="4" disabled={!tabsEnabled} />
            </Tabs>
          </Box>
          <Box sx={{ p: 3 }}>
            {tabValue === "1" && (
              <Box>
                <div dangerouslySetInnerHTML={{ __html: run.content }} />
              </Box>
            )}
            {tabValue === "2" && (
              <Box>
                <Typography variant="body1">
                  <ChartRuns />
                </Typography>
              </Box>
            )}
            {tabValue === "3" && (
              <Box>
                <Typography variant="body1">
                  <Result />
                </Typography>
              </Box>
            )}
            {tabValue === "4" && (
              <Box>
                <Typography variant="body1">
                  <Remarks />
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      ) : (
        <Typography color="error">Run not found.</Typography>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewRuns;
