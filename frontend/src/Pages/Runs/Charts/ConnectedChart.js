import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { InfluxDB } from '@influxdata/influxdb-client';
import { Snackbar, Select, MenuItem, OutlinedInput, Button } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

const waveOptions = ['sawtooth_wave', 'sine_wave', 'square_wave', 'triangle_wave'];

const ConnectedChart = ({ simulateStartTime, simulateStopTime }) => {
  const [simulateChartData, setSimulateChartData] = useState({
    sawtooth_wave: [],
    sine_wave: [],
    square_wave: [],
    triangle_wave: []
  });

  const [selectedWaves, setSelectedWaves] = useState(['', '', '', '']);
  const [isSimulateRunning, setIsSimulateRunning] = useState(false);
  const [chartType, setChartType] = useState('line'); // 'line' for real-time, 'area' for archived
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const influxDB = new InfluxDB({
      url: "https://us-east-1-1.aws.cloud2.influxdata.com/",
      token: "5uChyvv8PHHOp_BF5Uhu0-z8IfE3ckVoCfJp5NHiP54T4AXbtyjDcWl8zW9deVRhW6Td6W0xYc95bXDWGq3Peg=="
    });

    const queryApi = influxDB.getQueryApi('Learny');

    const fetchData = (startTime, endTime) => {
      if (!startTime || !endTime) return;

      const measurement = 'Simulate_connect';
      const query = `
        from(bucket: "Wave")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")
        |> filter(fn: (r) => r["_field"] == "sawtooth_wave" or r["_field"] == "sine_wave" or r["_field"] == "square_wave" or r["_field"] == "triangle_wave")
        |> filter(fn: (r) => r["location"] == "WavePoints")
        |> aggregateWindow(every: 1s, fn: mean, createEmpty: false)
        |> yield(name: "mean")
      `;

      const newChartData = {
        sawtooth_wave: [],
        sine_wave: [],
        square_wave: [],
        triangle_wave: []
      };

      queryApi.queryRows(query, {
        next: (row, tableMeta) => {
          const o = tableMeta.toObject(row);
          const field = o._field;
          const value = parseFloat(o._value).toFixed(3);

          if (!newChartData[field]) {
            newChartData[field] = [];
          }

          const localTime = dayjs.utc(o._time).tz('Asia/Kolkata').format();
          newChartData[field].push({ x: localTime, y: parseFloat(value) });
        },
        error: (error) => {
          console.error('Error querying InfluxDB', error);
          setSnackbarMessage('Error querying data.');
          setOpenSnackbar(true);
        },
        complete: () => {
          setSimulateChartData((prevData) => {
            const updatedData = { ...prevData };
            Object.keys(newChartData).forEach((key) => {
              updatedData[key] = [...newChartData[key]];
            });
            return updatedData;
          });
        }
      });
    };

    if (isSimulateRunning) {
      // Real-time data fetching
      const intervalId = setInterval(() => {
        fetchData(dayjs().subtract(1, 'minute').toDate(), new Date()); // fetch last minute data
      }, 10000); // update every 10 seconds

      return () => clearInterval(intervalId);
    } else if (simulateStartTime && simulateStopTime) {
      // Archived data fetching
      fetchData(simulateStartTime, simulateStopTime);
    }
  }, [simulateStartTime, simulateStopTime, isSimulateRunning]);

  const handleWaveChange = (index, event) => {
    const value = event.target.value;
    setSelectedWaves((prevSelectedWaves) => {
      const newSelectedWaves = [...prevSelectedWaves];
      newSelectedWaves[index] = value;
      return newSelectedWaves;
    });
  };

  const handleClearSelection = () => {
    setSelectedWaves(['', '', '', '']);
  };

  const apexOptions = {
    chart: {
      type: chartType,
      zoom: { enabled: true }
    },
    xaxis: {
      type: 'datetime',
      title: { text: 'Time' },
      tickAmount: 6
    },
    yaxis: {
      title: { text: 'Value' }
    },
    stroke: {
      width: [4, 4, 4, 4],
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    },
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],
    dataLabels: { enabled: false },
    tooltip: {
      x: { format: 'dd MMM yyyy HH:mm:ss' }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '14px',
      labels: { colors: ['#000'] }
    }
  };

  const simulateApexSeries = selectedWaves
    .filter((wave) => wave)
    .map((wave) => ({
      name: wave.replace('_', ' ').toUpperCase(),
      data: simulateChartData[wave]
    }));

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
        {selectedWaves.map((selectedWave, index) => (
          <Select
            key={index}
            value={selectedWave}
            onChange={(event) => handleWaveChange(index, event)}
            input={<OutlinedInput />}
            displayEmpty
            style={{ marginBottom: '10px', width: '150px' }}
          >
            <MenuItem disabled value="">
              <em>Select Wave</em>
            </MenuItem>
            {waveOptions.map((wave) => (
              <MenuItem
                key={wave}
                value={wave}
                disabled={selectedWaves.includes(wave) && selectedWave !== wave}
              >
                {wave.replace('_', ' ').toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        ))}
        <Button onClick={handleClearSelection} variant="contained" color="secondary">
          Clear
        </Button>
      </div>

      <div style={{ flex: 1 }}>
        <ApexCharts
          options={{
            ...apexOptions,
            title: {
              text: isSimulateRunning ? 'Real-time Chart' : 'Archived Chart',
              style: { fontSize: '20px', fontWeight: 'bold', color: '#263238' }
            }
          }}
          series={simulateApexSeries}
          type={chartType}
          height={350}
        />
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default ConnectedChart;
