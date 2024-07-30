import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';

const Chatbot = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    setResponse(null); // Clear previous responses
    try {
      const result = await fetch("http://localhost:4000/api/v1/prediction/ccf8c0c3-3231-4a59-8539-8827d54200e2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!result.ok) {
        throw new Error(`HTTP error! Status: ${result.status}`);
      }

      const data = await result.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message); // Set the exact error message
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 0,
        top: '10%',
        width: '300px',
        p: 2,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h6">Chatbot</Typography>
      <TextField
        fullWidth
        label="Ask a question"
        variant="outlined"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
      </Button>
      {error && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" color="error">Error: {error}</Typography>
        </Box>
      )}
      {response && (
        <Box sx={{ mt: 2, maxHeight: '300px', overflowY: 'auto' }}>
          <Typography variant="body1" gutterBottom>Response:</Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Chatbot;
