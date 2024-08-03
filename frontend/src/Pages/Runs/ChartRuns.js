import * as React from 'react';
import Radio from '@mui/material/Radio';
import TableChart from './Charts/TableChart'; 
import ConnectedChart from './Charts/ConnectedChart'; 

export default function RadioButtons() {
  const [selectedValue, setSelectedValue] = React.useState('table');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <div>
        <Radio
          checked={selectedValue === 'table'}
          onChange={handleChange}
          value="table"
          name="radio-buttons"
          inputProps={{ 'aria-label': 'Table Chart' }}
        />
        Table Chart
        <Radio
          checked={selectedValue === 'connected'}
          onChange={handleChange}
          value="connected"
          name="radio-buttons"
          inputProps={{ 'aria-label': 'Connected Chart' }}
        />
        Connected Chart
      </div>
      <br/>
      
      <div>
        {selectedValue === 'table' && <TableChart />}
        {selectedValue === 'connected' && <ConnectedChart />}
      </div>
    </div>
  );
}
