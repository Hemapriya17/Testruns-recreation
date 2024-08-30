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

const ConnectedChart = () => {
  const [simulateChartData, setSimulateChartData] = useState({
    sawtooth_wave: [],
    sine_wave: [],
    square_wave: [],
    triangle_wave: []
  });

  const [selectedWaves, setSelectedWaves] = useState(['', '', '', '']);
  const [isSimulateRunning, setIsSimulateRunning] = useState(false);
  const [simulateStartTime, setSimulateStartTime] = useState(null);
  const [simulateStopTime, setSimulateStopTime] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSimulateChart, setShowSimulateChart] = useState(true);

  useEffect(() => {
    let simulateIntervalId;

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

    if (isSimulateRunning && showSimulateChart) {
      // Fetch data in real-time while the simulation is running
      fetchData(simulateStartTime, new Date());
      simulateIntervalId = setInterval(() => fetchData(simulateStartTime, new Date()), 1000);
    } else if (!isSimulateRunning && simulateStopTime) {
      // Fetch archived data after the simulation is stopped
      fetchData(simulateStartTime, simulateStopTime);
    }

    return () => {
      clearInterval(simulateIntervalId);
    };
  }, [isSimulateRunning, simulateStartTime, simulateStopTime, showSimulateChart]);

  useEffect(() => {
    if (showSimulateChart) {
      setIsSimulateRunning(true);
      setSimulateStartTime(new Date());
      setSimulateStopTime(null);
    } else {
      setIsSimulateRunning(false);
      setSimulateStopTime(new Date());
    }
  }, [showSimulateChart]);

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

  const trimToLast12Seconds = (data) => {
    const currentTime = dayjs();
    return data.filter((point) =>
      dayjs(point.x).isAfter(currentTime.subtract(12, 'seconds'))
    );
  };

  const apexOptions = {
    chart: {
      type: 'line',
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
      data: trimToLast12Seconds(simulateChartData[wave])
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
              <MenuItem key={wave} value={wave} disabled={selectedWaves.includes(wave) && selectedWave !== wave}>
                {wave.replace('_', ' ').toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        ))}
        <Button onClick={handleClearSelection} variant="contained" color="secondary">
          Clear
        </Button>
      </div>

      {showSimulateChart && (
        <div style={{ flex: 1 }}>
          <ApexCharts
            options={{ ...apexOptions, title: { text: 'Simulate', style: { fontSize: '20px', fontWeight: 'bold', color: '#263238' } } }}
            series={simulateApexSeries}
            type="line"
            height={350}
          />
        </div>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} />
    </div>
  );
};

export default ConnectedChart;
