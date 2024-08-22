import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import { FormControl, Select, MenuItem, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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
      cells.forEach(cell => headers.push(cell.textContent.trim()));
    } else {
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

const TableChart = ({ tableHtml, inputValues }) => {
  const [tableElement, setTableElement] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [yAxisSelectors, setYAxisSelectors] = useState(['']);

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
        setYAxisSelectors(['']);
      }
    }
  }, [tableElement, inputValues]);

  if (headers.length === 0 || data.length === 0) {
    return <div>No valid data to display.</div>;
  }

  const handleAddYAxis = () => {
    setYAxisSelectors([...yAxisSelectors, '']);
  };

  const handleRemoveYAxis = (index) => {
    if (yAxisSelectors.length > 1) {
      setYAxisSelectors(yAxisSelectors.filter((_, i) => i !== index));
    }
  };

  const handleYAxisChange = (index, event) => {
    const newYAxisSelectors = [...yAxisSelectors];
    newYAxisSelectors[index] = event.target.value;
    setYAxisSelectors(newYAxisSelectors);
  };

  const xAxisValues = data.map(d => d[selectedXAxis]).filter(value => value !== undefined);

  const apexSeries = yAxisSelectors.map((yAxis, index) => {
    const yAxisValues = data.map(d => d[yAxis]).filter(value => value !== undefined);
    return {
      name: yAxis || `Series ${index + 1}`,
      data: yAxisValues,
      yAxisIndex: index
    };
  });

  const apexOptions = {
    chart: {
      type: 'line',
    },
    xaxis: {
      categories: xAxisValues,
      title: {
        text: selectedXAxis || 'X Axis'
      }
    },
    yaxis: yAxisSelectors.map((yAxis, index) => ({
      title: {
        text: yAxis || `Y Axis ${index + 1}`
      },
      opposite: index % 2 === 1 // To alternate Y axes on left and right
    })),
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'], // Colors for multiple series
    stroke: {
      width: 3
    },
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ width: '100%', height: "350px" }}>
          <ApexCharts
            options={apexOptions}
            series={apexSeries}
            type="line"
            height={350}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 0.5, marginLeft: '20px' }}>
        <FormControl variant="outlined" style={{ minWidth: 150, marginBottom: '20px' }}>
          <Typography>Select X-Axis</Typography>
          <Select
            value={selectedXAxis}
            onChange={(e) => setSelectedXAxis(e.target.value)}
          >
            {headers.map((header, index) => (
              <MenuItem key={index} value={header}>{header}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography style={{ marginBottom: '10px' }}>Select Y-Axis
        <IconButton onClick={handleAddYAxis} color="primary">
          <AddIcon />
        </IconButton>
        </Typography>
        {yAxisSelectors.map((yAxis, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <FormControl variant="outlined" style={{ minWidth: 150, marginRight: '10px' }}>
              <Select
                value={yAxis}
                onChange={(event) => handleYAxisChange(index, event)}
              >
                {headers.map((header, headerIndex) => (
                  <MenuItem key={headerIndex} value={header}>{header}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {index > 0 && (
              <IconButton onClick={() => handleRemoveYAxis(index)} color="secondary" style={{ marginRight: '10px' }}>
                <RemoveIcon />
              </IconButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableChart;
