import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

// Helper functions for data extraction and conversion
const extractTableData = (tableElement, inputValues) => {
  if (!tableElement) {
    console.error('Table element not found');
    return { headers: [], data: [] };
  }

  const rows = tableElement.querySelectorAll('tr');
  const data = [];
  const headers = [];

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td');
    if (rowIndex === 0) {
      // Extract headers
      cells.forEach(cell => headers.push(cell.textContent.trim()));
    } else {
      // Extract and map input values
      const rowData = {};
      cells.forEach((cell, cellIndex) => {
        const inputElement = cell.querySelector('input');
        const inputId = inputElement ? inputElement.id : null;
        const inputValue = inputId && inputValues[inputId] !== undefined ? inputValues[inputId] : undefined;
        rowData[headers[cellIndex]] = inputValue;
      });
      data.push(rowData);
    }
  });

  return { headers, data };
};

const convertTableDataToChartData = (headers, data) => {
  if (!headers.length || !data.length) {
    console.error('Invalid headers or data');
    return [];
  }

  return data.map(row => {
    const chartData = {};
    headers.forEach(header => {
      chartData[header] = row[header];
    });
    return chartData;
  });
};

// TableChart component
const TableChart = ({ tableHtml, inputValues }) => {
  const [tableElement, setTableElement] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');

  useEffect(() => {
    const parsedElement = new DOMParser().parseFromString(tableHtml, 'text/html').querySelector('table');
    setTableElement(parsedElement);
  }, [tableHtml]);

  useEffect(() => {
    if (tableElement) {
      const { headers, data } = extractTableData(tableElement, inputValues);
      setHeaders(headers);
      setData(convertTableDataToChartData(headers, data));
      if (headers.length > 0) {
        setSelectedXAxis(headers[0]);
        setSelectedYAxis(headers[1]);
      }
    }
  }, [tableElement, inputValues]);

  if (headers.length === 0 || data.length === 0) {
    return <div>No valid data to display.</div>;
  }

  // Prepare ApexCharts data
  const xAxisValues = data.map(d => d[selectedXAxis]);
  const yAxisValues = data.map(d => d[selectedYAxis]);
  const apexSeries = [{
    name: 'Input Values',
    data: yAxisValues
  }];
  const apexOptions = {
    chart: {
      type: 'line',
    },
    xaxis: {
      categories: xAxisValues,
      title: {
        text: selectedXAxis
      }
    },
    yaxis: {
      title: {
        text: selectedYAxis
      }
    },
    colors: ['#1f77b4'],
    stroke: {
      width: 3
    },
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Select X-Axis:</label>
        <select value={selectedXAxis} onChange={(e) => setSelectedXAxis(e.target.value)}>
          {headers.map((header, index) => (
            <option key={index} value={header}>{header}</option>
          ))}
        </select>

        <label style={{ marginLeft: '20px', marginRight: '10px' }}>Select Y-Axis:</label>
        <select value={selectedYAxis} onChange={(e) => setSelectedYAxis(e.target.value)}>
          {headers.map((header, index) => (
            <option key={index} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div style={{ width: '100%', height: "350px" }}>
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

export default TableChart;
