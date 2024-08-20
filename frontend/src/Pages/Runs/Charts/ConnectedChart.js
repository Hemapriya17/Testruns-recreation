import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { InfluxDB } from '@influxdata/influxdb-client';
import { Snackbar, Select, MenuItem, OutlinedInput, Button, Box } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const waveOptionsMap = {
  Simulate_connect: ['sawtooth_wave', 'sine_wave', 'square_wave', 'triangle_wave'],
  Demo_connect: ['cosine_wave', 'exp_decay_wave', 'gaussian_wave', 'rectified_sine_wave']
};

const measurementOptions = ['Simulate_connect', 'Demo_connect'];

const ConnectedChart = () => {
  const [simulateChartData, setSimulateChartData] = useState({
    sawtooth_wave: [],
    sine_wave: [],
    square_wave: [],
    triangle_wave: [],
    cosine_wave: [],
    exp_decay_wave: [],
    gaussian_wave: [],
    rectified_sine_wave: []
  });
  const [isSimulateRunning, setIsSimulateRunning] = useState(false);
  const [simulateStartTime, setSimulateStartTime] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [charts, setCharts] = useState([{ id: 1, measurement: 'Simulate_connect', waves: ['', '', '', ''] }]);

  useEffect(() => {
    const influxDB = new InfluxDB({
      url: 'http://localhost:8086',
      token: 'WDDwXl5yivgQ3Wnh_4E1olNOf06XRWDbtblx8m6yEmLhFRBl7sR_9gy8ZGDwkcu4qb51hyML89jpanMD3ClnbA==',
    });

    const queryApi = influxDB.getQueryApi('Learny');

    const fetchData = (startTime, measurement) => {
      let query = '';

      if (measurement === 'Simulate_connect') {
        query = `
          from(bucket: "Wave")
          |> range(start: ${startTime.toISOString()})
          |> filter(fn: (r) => r["_measurement"] == "Simulate_connect")
          |> filter(fn: (r) => r["_field"] == "sawtooth_wave" or r["_field"] == "sine_wave" or r["_field"] == "square_wave" or r["_field"] == "triangle_wave")
          |> filter(fn: (r) => r["location"] == "WavePoints")
          |> aggregateWindow(every: 1s, fn: mean, createEmpty: false)
          |> yield(name: "mean")
        `;
      } else if (measurement === 'Demo_connect') {
        query = `
          from(bucket: "Wave")
          |> range(start: ${startTime.toISOString()})
          |> filter(fn: (r) => r["_measurement"] == "Demo_connect")
          |> filter(fn: (r) => r["_field"] == "cosine_wave" or r["_field"] == "exp_decay_wave" or r["_field"] == "gaussian_wave" or r["_field"] == "rectified_sine_wave")
          |> filter(fn: (r) => r["location"] == "DemoPoints")
          |> aggregateWindow(every: 1s, fn: mean, createEmpty: false)
          |> yield(name: "mean")
        `;
      }

      const newChartData = {
        sawtooth_wave: [],
        sine_wave: [],
        square_wave: [],
        triangle_wave: [],
        cosine_wave: [],
        exp_decay_wave: [],
        gaussian_wave: [],
        rectified_sine_wave: []
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
              updatedData[key] = [
                ...(updatedData[key] || []),
                ...newChartData[key]
              ];
            });
            console.log('Updated chart data:', updatedData); // Add this line
            return updatedData;
          });
        }
      });
    };

    if (isSimulateRunning) {
      charts.forEach((chart) => {
        fetchData(simulateStartTime, chart.measurement);
      });

      const intervalId = setInterval(() => {
        charts.forEach((chart) => {
          fetchData(simulateStartTime, chart.measurement);
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isSimulateRunning, simulateStartTime, charts]);

  useEffect(() => {
    if (charts.length > 0) {
      setIsSimulateRunning(true);
      setSimulateStartTime(new Date());
    } else {
      setIsSimulateRunning(false);
    }
  }, [charts]);

  const handleWaveChange = (index, waveIndex, event) => {
    const value = event.target.value;
    setCharts((prevCharts) => {
      const updatedCharts = [...prevCharts];
      updatedCharts[index].waves[waveIndex] = value;
      return updatedCharts;
    });
  };

  const handleMeasurementChange = (index, event) => {
    const value = event.target.value;
    setCharts((prevCharts) => {
      const updatedCharts = [...prevCharts];
      updatedCharts[index].measurement = value;
      updatedCharts[index].waves = ['', '', '', '']; // Reset waves on measurement change
      return updatedCharts;
    });
  };

  const handleAddChart = () => {
    setCharts((prevCharts) => [...prevCharts, { id: prevCharts.length + 1, measurement: 'Simulate_connect', waves: ['', '', '', ''] }]);
  };

  const handleRemoveChart = (index) => {
    setCharts((prevCharts) => prevCharts.filter((_, i) => i !== index));
  };

  const apexOptions = {
    chart: {
      type: 'line',
      zoom: { enabled: true },
    },
    xaxis: {
      type: 'datetime',
      title: { text: 'Time' },
      tickAmount: 6,
    },
    yaxis: {
      title: { text: 'Value' },
    },
    stroke: {
      width: [4, 4, 4, 4],
      curve: 'smooth',
    },
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],
    dataLabels: { enabled: false },
    tooltip: {
      x: { format: 'dd MMM yyyy HH:mm:ss' },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '14px',
      labels: { colors: ['#000'] },
    },
  };

  const renderChart = (chart, index) => (
    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
      <ApexCharts
        options={{ ...apexOptions, title: { text: `Chart ${index + 1}`, style: { fontSize: '20px', fontWeight: 'bold', color: '#263238' } } }}
        series={chart.waves.map((waveKey) => {
          const wave = waveKey;
          if (wave && simulateChartData[wave]) {
            return { name: wave.replace('_', ' ').toUpperCase(), data: simulateChartData[wave] };
          }
          return null;
        }).filter(Boolean)}
        type="line"
        height={350}
        width={700}
      />
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
        <Select
          value={chart.measurement}
          onChange={(event) => handleMeasurementChange(index, event)}
          input={<OutlinedInput />}
          displayEmpty
          style={{ marginBottom: '10px', width: '200px' }}
        >
          {measurementOptions.map((measurement, i) => (
            <MenuItem key={i} value={measurement}>
              {measurement}
            </MenuItem>
          ))}
        </Select>
        {chart.waves.map((wave, waveIndex) => (
          <Select
            key={waveIndex}
            value={wave}
            onChange={(event) => handleWaveChange(index, waveIndex, event)}
            input={<OutlinedInput />}
            displayEmpty
            style={{ marginBottom: '10px', width: '150px' }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {waveOptionsMap[chart.measurement].map((waveOption, i) => (
              <MenuItem key={i} value={waveOption}>
                {waveOption.replace('_', ' ').toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        ))}
        {charts.length > 1 && (
          <Button
            variant="outlined"
            color="error"
            style={{ marginTop: '10px' }}
            onClick={() => handleRemoveChart(index)}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {charts.map((chart, index) => renderChart(chart, index))}

      <Button onClick={handleAddChart} variant="contained" color="primary" style={{ marginTop: '20px' }}>
        Add Chart
      </Button>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} />
    </div>
  );
};

export default ConnectedChart;
