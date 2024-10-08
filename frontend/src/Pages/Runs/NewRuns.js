import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Alert,
} from "@mui/material";
import ChartRuns from "./ChartRuns";
import Result from "./Result";
import Remarks from "./Remarks";
import ApiUrl from '../../ServerApi';

const NewRuns = () => {
  const { procedureID } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState("1");
  const [tabsEnabled, setTabsEnabled] = useState(false);
  const [startButtonDisabled, setStartButtonDisabled] = useState(false);
  const [stopButtonDisabled, setStopButtonDisabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [inputValues, setInputValues] = useState({});
  const [runData, setRunData] = useState(null);
  const [tableHtml, setTableHtml] = useState("");
  const [simulateStartTime, setSimulateStartTime] = useState(null);
  const [simulateStopTime, setSimulateStopTime] = useState(null);
  const contentRef = useRef(null);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = snackbarState;

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/api/runs/${procedureID}`);
        const fetchedRun = response.data;
        setRun(fetchedRun);
        setInputValues(fetchedRun.inputValues || {});
        setRunData(fetchedRun);
        setTableHtml(fetchedRun.content || "");

        if (contentRef.current) {
          contentRef.current.innerHTML = fetchedRun.content || "";
        }

        updateButtonAndTabStates(fetchedRun.status);
      } catch (error) {
        console.error("Error fetching run:", error);
        setError("Failed to load run details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRun();
  }, [procedureID]);

  useEffect(() => {
    if (run && contentRef.current) {
      const inputs = contentRef.current.querySelectorAll('input[type="text"]');
      inputs.forEach((input) => {
        const value = inputValues[input.id];
        if (value !== undefined) {
          input.value = value;
        }
      });
    }
  }, [inputValues, tabValue, run]);

  const updateButtonAndTabStates = (status) => {
    switch (status) {
      case "Started":
        setStartButtonDisabled(true);
        setStopButtonDisabled(false);
        setTabsEnabled(true);
        break;
      case "Stopped":
        setStartButtonDisabled(true);
        setStopButtonDisabled(true);
        setTabsEnabled(true);
        break;
      default:
        setStartButtonDisabled(false);
        setStopButtonDisabled(true);
        setTabsEnabled(false);
        break;
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === "2" && contentRef.current) {
      setTableHtml(contentRef.current.innerHTML);
    }
  };

  const updateRunStatus = async (status, successMessage) => {
    try {
      const response = await axios.put(`${ApiUrl}/api/runs/${procedureID}`, { status });
      const updatedRun = response.data;
      setRun(updatedRun);
      setSnackbarMessage(successMessage);
      setSnackbarState({ ...snackbarState, open: true });
      updateButtonAndTabStates(updatedRun.status);
    } catch (error) {
      console.error("Error updating run status:", error);
      setError("Failed to update run status.");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarState({ ...snackbarState, open: false });
  };

  const handleStart = async () => {
    try {
      await axios.post(`${ApiUrl}/api/runs/${procedureID}/start`);
      setSimulateStartTime(new Date()); // Set start time when starting
      updateRunStatus("Started", "Run has been started!");
    } catch (error) {
      console.error("Error starting the script:", error);
      setError("Failed to start the script.");
    }
  };

  const handleStop = async () => {
    try {
      await axios.post(`${ApiUrl}/api/runs/${procedureID}/stop`);
      setSimulateStopTime(new Date()); // Set stop time when stopping
      updateRunStatus("Stopped", "Run has been stopped!");
    } catch (error) {
      console.error("Error stopping the script:", error);
      setError("Failed to stop the script.");
    }
  };

  const handleBack = () => {
    navigate("/runs");
  };

  const handleSave = async () => {
    const updatedContent = contentRef.current.innerHTML;

    const extractInputValues = () => {
      const inputs = contentRef.current.querySelectorAll('input[type="text"]');
      const values = {};
      inputs.forEach((input) => {
        values[input.id] = parseFloat(input.value) || 0;
      });
      return values;
    };

    const updatedInputValues = extractInputValues();

    const updatedRun = {
      ...run,
      content: updatedContent,
      inputValues: updatedInputValues,
    };

    try {
      const response = await axios.put(`${ApiUrl}/api/runs/${procedureID}`, updatedRun);
      const savedRun = response.data;

      const dataForPython = {
        ...updatedInputValues,
        title: savedRun.procedureName || "Default Title",
      };

      const pythonResponse = await axios.post(`${ApiUrl}/api/runPython`, dataForPython);
      const results = pythonResponse.data;

      setRun(savedRun);
      setInputValues(savedRun.inputValues);
      setRunData({ ...savedRun, results });
      setSnackbarMessage("Run has been saved and results updated successfully");
      setSnackbarState({ ...snackbarState, open: true });
    } catch (error) {
      console.error("Error saving run or running script:", error.response?.data || error.message);
      setError("Failed to save run or run the script.");
    }
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
          color="error"
          onClick={handleStop}
          disabled={stopButtonDisabled}
        >
          Stop
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        <Typography variant="body1">
          <b>Runs Objective:</b> {run.objective}
        </Typography>
        <Typography variant="body1">
          <b>Status:</b> {run.status}
        </Typography>
      </Box>

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
          <Box>
            {tabValue === "1" && (
              <Box
                sx={{
                  height: "400px",
                  overflowY: "auto",
                  padding: "16px",
                  borderRadius: "4px",
                }}
              >
                <div
                  ref={contentRef}
                  dangerouslySetInnerHTML={{ __html: tableHtml }}
                />
              </Box>
            )}

            {tabValue === "2" && (
              <Box>
                <Typography variant="body1">
                  <ChartRuns
                    tableHtml={tableHtml}
                    inputValues={inputValues}
                    simulateStartTime={simulateStartTime}
                    simulateStopTime={simulateStopTime}
                    setSimulateStartTime={setSimulateStartTime}
                    setSimulateStopTime={setSimulateStopTime}
                  />
                </Typography>
              </Box>
            )}

            {tabValue === "3" && (
              <Box>
                {runData ? <Result runData={runData} /> : <p>Loading...</p>}
              </Box>
            )}

            {tabValue === "4" && (
              <Box>
                <Typography variant="body1">
                  <Remarks runData={run} />
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      ) : (
        <Typography>No run data available</Typography>
      )}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button sx={{ mt: 2 }} variant="outlined" color="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </div>
    </Container>
  );
};

export default NewRuns;
