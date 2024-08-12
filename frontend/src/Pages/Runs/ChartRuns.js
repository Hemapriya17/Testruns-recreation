import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import TableChart from './Charts/TableChart';
import ConnectedChart from './Charts/ConnectedChart';

const ChartRuns = ({ tableHtml, inputValues }) => {
  const [selectedChart, setSelectedChart] = useState('table');

  const handleChartChange = (event) => {
    setSelectedChart(event.target.value);
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Radio
          checked={selectedChart === 'table'}
          onChange={handleChartChange}
          value="table"
          name="chart-radio-buttons"
          inputProps={{ 'aria-label': 'Table Chart' }}
        />
        Table Chart
        <Radio
          checked={selectedChart === 'connected'}
          onChange={handleChartChange}
          value="connected"
          name="chart-radio-buttons"
          inputProps={{ 'aria-label': 'Connected Chart' }}
        />
        Connected Chart
      </div>

      <br />

      <div>
        {selectedChart === 'table' && <TableChart tableHtml={tableHtml} inputValues={inputValues} />}
        {selectedChart === 'connected' && <ConnectedChart />}
      </div>
    </div>
  );
};

export default ChartRuns;
