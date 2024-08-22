import React, { useState } from 'react';
import { Button, Input } from '@mui/material';
import axios from 'axios';

const ExtractProcedure = ({ onExtract }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleExtract = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      axios.post('https://testruns-backends.vercel.app//upload', formData)
        .then(response => {
          if (response.data.text) {
            onExtract(response.data.text.join('\n'));
          } else {
            console.error('No text found in the response.');
          }
        })
        .catch(error => {
          console.error('Error extracting text:', error);
        });
    } else {
      console.error('No file selected.');
    }
  };

  return (
    <div>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleExtract} variant="contained" color="primary">
        Extract Text
      </Button>
    </div>
  );
};

export default ExtractProcedure;
