import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Runs from "./Dashboard/Runs";
import MypageCalendar from "./Dashboard/Calendar";
import RunsStatus from "./Dashboard/RunsStatus";
import CreatedOnChart from "./Dashboard/CreatedOnChart"; // Updated import

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const MyPage = () => {
  const [dueDates, setDueDates] = useState([]);
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    axios
      .get("https://testruns-backend.onrender.com/api/runs")
      .then((response) => {
        const dates = response.data.map((run) => run.dueDate);
        console.log("Fetched due dates:", dates); // Log due dates
        setDueDates(dates);
        setRuns(response.data); // Set the runs data for RunsStatus and CreatedOnChart
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Box sx={{ width: 1 }}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 12">
          <Item>
            <Runs />
          </Item>
        </Box>
        <Box gridColumn="span 4">
        <Item sx={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <MypageCalendar  sx={{ height: "300px", alignItems: "center" }} dueDates={dueDates} />
          </Item>
        </Box>
        <Box gridColumn="span 3">
        <Item sx={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <RunsStatus runs={runs} />
          </Item>
        </Box>
        <Box gridColumn="span 5">
        <Item sx={{ height: "300px"}}>
            <CreatedOnChart runs={runs} /> {/* Pass the runs data as a prop */}
          </Item>
        </Box>
      </Box>
    </Box>
  );
};

export default MyPage;
