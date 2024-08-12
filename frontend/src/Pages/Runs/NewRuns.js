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
  const [tableHtml, setTableHtml] = useState(""); // Move here

  const contentRef = useRef(null);

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/runs/${procedureID}`
        );
        const fetchedRun = response.data;
        setRun(fetchedRun);
        setInputValues(fetchedRun.inputValues || {});
        setRunData(fetchedRun); // Set runData here

        if (contentRef.current) {
          contentRef.current.innerHTML = fetchedRun.content;
          setTableHtml(fetchedRun.content); // Set tableHtml here
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
    if (status === "Started") {
      setStartButtonDisabled(true);
      setStopButtonDisabled(false);
      setTabsEnabled(true);
    } else if (status === "Stopped") {
      setStartButtonDisabled(true);
      setStopButtonDisabled(true);
      setTabsEnabled(true);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === "2" && contentRef.current) {
      const tableHtml = contentRef.current.innerHTML;
      setTableHtml(tableHtml); // Ensure tableHtml is set
    }
  };

  const updateRunStatus = async (status, successMessage) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/runs/${procedureID}`,
        { status }
      );
      const updatedRun = response.data;
      setRun(updatedRun);
      setSnackbarMessage(successMessage);
      setSnackbarOpen(true);
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
    setSnackbarOpen(false);
  };

  const handleStart = () => {
    updateRunStatus("Started", "Run has been started");
  };

  const handleStop = () => {
    updateRunStatus("Stopped", "Run has been stopped");
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
      const response = await axios.put(
        `http://localhost:8000/api/runs/${procedureID}`,
        updatedRun
      );
      const savedRun = response.data;

      setSnackbarMessage("Run has been saved successfully");
      setSnackbarOpen(true);
      setRun(savedRun);
      setInputValues(savedRun.inputValues);
    } catch (error) {
      console.error("Error saving run:", error.response?.data || error.message);
      setError("Failed to save run.");
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
      <Typography style={{ padding: "10px" }} variant="body1">
        {run.objective}
      </Typography>
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
                  dangerouslySetInnerHTML={{ __html: run.content }}
                />
              </Box>
            )}

            {tabValue === "2" && (
              <Box>
                <Typography variant="body1">
                  <ChartRuns tableHtml={tableHtml} inputValues={inputValues} />
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
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Container>
  );
};

export default NewRuns;
