import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Chart from "react-apexcharts";

const statusColorMapping = {
  completed: "success.main",
  started: "warning.main",
  created: "grey.500",
  stopped: "error.main",
};

const fallbackColors = {
  completed: "#4caf50", // green
  started: "#ff9800", // orange
  created: "#9e9e9e", // grey
  stopped: "#f44336", // red
};

const RunsStatus = ({ runs }) => {
  const theme = useTheme();

  const statusCounts = runs.reduce((acc, run) => {
    const status = run.status.toLowerCase();
    if (acc[status]) {
      acc[status]++;
    } else {
      acc[status] = 1;
    }
    return acc;
  }, {});

  const labels = Object.keys(statusCounts);
  const series = Object.values(statusCounts);
  const colors = labels.map(
    (label) =>
      (
        theme.palette[statusColorMapping[label]] || {
          main: fallbackColors[label],
        }
      ).main
  );

  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels,
    colors,
    legend: {
      position: "bottom",
    },
  };

  return (
    // <Card>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="300px"
      >
        <Chart
          options={chartOptions}
          series={series}
          type="pie"
          width="100%"
          height="100%"
        />
      </Box>
    // </Card>
  );
};

export default RunsStatus;
