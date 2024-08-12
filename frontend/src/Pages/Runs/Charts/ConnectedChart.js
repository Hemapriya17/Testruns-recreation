import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { InfluxDB } from '@influxdata/influxdb-client';

const ConnectedChart = () => {
  const [chartData, setChartData] = useState({
    sawtooth_wave: [],
    sine_wave: [],
    square_wave: [],
    triangle_wave: []
  });

  useEffect(() => {
    const influxDB = new InfluxDB({
      url: 'http://localhost:8086',
      token: 'WDDwXl5yivgQ3Wnh_4E1olNOf06XRWDbtblx8m6yEmLhFRBl7sR_9gy8ZGDwkcu4qb51hyML89jpanMD3ClnbA=='
    });

    const queryApi = influxDB.getQueryApi('Learny');  // Replace 'Learny' with your actual organization name

    const query = `
    from(bucket: "Wave")
    |> range(start: -1m)
    |> filter(fn: (r) => r["_measurement"] == "Demo_connect")
    |> filter(fn: (r) => r["_field"] == "sawtooth_wave" or r["_field"] == "sine_wave" or r["_field"] == "square_wave" or r["_field"] == "triangle_wave")
    |> filter(fn: (r) => r["location"] == "WavePoints")
    |> aggregateWindow(every: 1s, fn: mean, createEmpty: false)
    |> yield(name: "mean")
    `;

    const fetchData = () => {
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
          const value = parseFloat(o._value);

          if (newChartData[field]) {
            newChartData[field].push({ x: o._time, y: value });
          }
        },
        error: (error) => {
          console.error('Error querying InfluxDB', error);
        },
        complete: () => {
          setChartData(prevData => {
            const updatedData = { ...prevData };
            Object.keys(newChartData).forEach(key => {
              updatedData[key] = [...newChartData[key]];
            });
            return updatedData;
          });
        }
      });
    };

    fetchData();  // Fetch data initially

    const intervalId = setInterval(fetchData, 1000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const apexOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: true
      },
      // animations: {
      //   enabled: true,
      //   easing: 'easeinout',  // Smooth transitions
      //   speed: 1000
      // }
    },
    xaxis: {
      type: 'datetime',
      title: {
        text: 'Time'
      },
      tickAmount: 6
    },
    yaxis: {
      title: {
        text: 'Value'
      }
    },
    stroke: {
      // curve: 'smooth',  // Smooth for sine wave
      width: [2,2,2,2]  // Set width for different waves
    },
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],
    // title: {
    //   text: 'Running Waveforms'
    // },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy HH:mm:ss'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    }
  };

  const apexSeries = [
    {
      name: 'Sawtooth Wave',
      data: chartData.sawtooth_wave
    },
    {
      name: 'Sine Wave',
      data: chartData.sine_wave
    },
    {
      name: 'Square Wave',
      data: chartData.square_wave
    },
    {
      name: 'Triangle Wave',
      data: chartData.triangle_wave
    }
  ];

  return (
    <div>
      <div style={{ width: '100%', height: '450px' }}>
        <ApexCharts
          options={apexOptions}
          series={apexSeries}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};

export default ConnectedChart;
