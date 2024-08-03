// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const ConnectedChart = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = new Date();
//       const newDataPoint = {
//         time: now.toLocaleTimeString(),
//         value: Math.floor(Math.random() * 100)
//       };

//       setData(currentData => {
//         const newData = [...currentData, newDataPoint];
//         if (newData.length > 20) {
//           newData.shift();
//         }
//         return newData;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="w-full h-64">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis 
//             dataKey="time"
//             interval="preserveStartEnd"
//             tick={{ fontSize: 10 }}
//           />
//           <YAxis 
//             tick={{ fontSize: 10 }}
//           />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="value" stroke="#8884d8" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ConnectedChart;

// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// // Constants for wave patterns
// const AMPLITUDE = 50;
// const OFFSET = 50;
// const FREQUENCY = 1 / 10; // Controls the frequency of the wave

// // Generate initial data with multiple wave patterns
// const generateInitialData = () => {
//   const now = new Date().getTime();
//   return Array.from({ length: 50 }, (_, i) => ({
//     name: new Date(now - (50 - i) * 1000).toLocaleTimeString(),
//     sine: generateWaveValue(i, 'sine'),
//     triangle: generateWaveValue(i, 'triangle'),
//     sawtooth: generateWaveValue(i, 'sawtooth'),
//     square: generateWaveValue(i, 'square'),
//     rectangle: generateWaveValue(i, 'rectangle'),
//   }));
// };

// // Function to generate a new data point with multiple wave patterns
// const generateNewDataPoint = (index) => {
//   const now = new Date().toLocaleTimeString();
//   return {
//     name: now,
//     sine: generateWaveValue(index, 'sine'),
//     triangle: generateWaveValue(index, 'triangle'),
//     sawtooth: generateWaveValue(index, 'sawtooth'),
//     square: generateWaveValue(index, 'square'),
//     rectangle: generateWaveValue(index, 'rectangle'),
//   };
// };

// // Function to generate wave values
// const generateWaveValue = (index, waveType) => {
//   const phase = (index / 10) * Math.PI;
//   switch (waveType) {
//     case 'sine':
//       return AMPLITUDE * Math.sin(phase) + OFFSET;
//     case 'triangle':
//       return AMPLITUDE * (2 / Math.PI) * Math.asin(Math.sin(phase)) + OFFSET;
//     case 'sawtooth':
//       return AMPLITUDE * ((index / 10) % 1) * 2 - AMPLITUDE + OFFSET;
//     case 'square':
//       return AMPLITUDE * (Math.sin(phase) > 0 ? 1 : -1) + OFFSET;
//     case 'rectangle':
//       return AMPLITUDE * ((Math.floor(index / 10) % 2 === 0 ? 1 : -1)) + OFFSET;
//     default:
//       return OFFSET;
//   }
// };

// const ConnectedChart = () => {
//   const [data, setData] = useState(generateInitialData());
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setData(prevData => {
//         const newData = generateNewDataPoint(index);
//         setIndex(prevIndex => prevIndex + 1);
//         return [...prevData.slice(1), newData]; // Remove the oldest point and add the new one
//       });
//     }, 1000); // Update every second

//     return () => clearInterval(intervalId); // Cleanup interval on component unmount
//   }, [index]);

//   return (
//     <div style={{ width: '100%', height: 400 }}>
//       <ResponsiveContainer>
//         <LineChart
//           data={data}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="sine" stroke="#8884d8" />
//           <Line type="monotone" dataKey="triangle" stroke="#82ca9d" />
//           <Line type="monotone" dataKey="sawtooth" stroke="#ffc658" />
//           <Line type="monotone" dataKey="square" stroke="#ff7300" />
//           <Line type="monotone" dataKey="rectangle" stroke="#ff0000" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ConnectedChart;



import React from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

// Initial data and configuration
const XAXISRANGE = 10000; // 90 days in milliseconds
const maxDataPoints = 50;
const initialData = Array.from({ length: maxDataPoints }, (_, i) => [
  new Date().getTime() - (maxDataPoints - i) * 1000,
  Math.floor(Math.random() * 100)
]);

const getNewSeries = (lastDate, { min, max }) => {
  const newDate = new Date(lastDate + 1000);
  return {
    data: [
      [newDate.getTime(), Math.floor(Math.random() * (max - min + 1)) + min],
    ],
  };
};

class ConnectedChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [{
        data: initialData
      }],
      options: {
        chart: {
          id: 'realtime',
          height: 350,
          type: 'line',
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        // title: {
        //   text: 'Dynamic Updating Chart',
        //   align: 'left'
        // },
        markers: {
          size: 0
        },
        xaxis: {
          type: 'datetime',
          range: XAXISRANGE,
        },
        yaxis: {
          max: 100
        },
        legend: {
          show: false
        },
      },
    };

    this.lastDate = new Date().getTime();
  }

  componentDidMount() {
    this.interval = window.setInterval(() => {
      const newSeries = getNewSeries(this.lastDate, {
        min: 10,
        max: 90
      });
      this.lastDate = newSeries.data[0][0];

      this.setState(prevState => {
        const updatedData = [...prevState.series[0].data, ...newSeries.data];
        if (updatedData.length > maxDataPoints) {
          updatedData.shift(); // Remove oldest data point
        }
        return {
          series: [{
            data: updatedData
          }]
        };
      });

      ApexCharts.exec('realtime', 'updateSeries', [{
        data: this.state.series[0].data
      }]);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="line"
            height={350}
          />
        </div>
      </div>
    );
  }
}

export default ConnectedChart;

