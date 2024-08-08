import React from 'react';
import Chart from 'react-apexcharts';

const CreatedOnChart = ({ runs }) => {
  const data = runs.reduce((acc, run) => {
    const date = new Date(run.createdOn).toISOString().split('T')[0];
    const existingEntry = acc.find(entry => entry.date === date);
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []);

  // Define colors for different ranges
  const getColor = (value) => {
    if (value === 1) return '#5B9DF4'; // Blue
    if (value === 2) return '#7EE4AA'; // Green
    if (value === 3) return '#EE6D7A'; // Pink
    if (value === 4) return '#F4BF5F'; // Orange
    return '#8884d8'; // Default color
  };

  const chartData = data.map((item) => ({
    x: item.date,
    y: item.count
  }));

  const series = [{
    name: 'Count',
    data: chartData
  }];

  const options = {
    chart: {
      type: 'bar'
    },
    plotOptions: {
      bar: {
        distributed: true,
        dataLabels: {
          position: 'top' // Show data labels on top
        }
      }
    },
    xaxis: {
      categories: data.map(item => item.date),
      title: {
        text: 'Date'
      }
    },
    yaxis: {
      title: {
        text: 'Count'
      }
    },
    colors: data.map(item => getColor(item.count))
  };

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default CreatedOnChart;
