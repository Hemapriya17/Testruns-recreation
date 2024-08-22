import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Grid, Button, Alert, Stack, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import ApiUrl from '../../ServerApi';

const Newprocedure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    _id: '', // MongoDB _id field
    procedureName: '',
    department: 'Dept 1',
    laboratory: 'Lab 1',
    content: '',
    userId: '669b86da74088e9469ed9ac7',
    assetId: '' // Add this field to hold the asset ID
  });
  const [notification, setNotification] = useState({ message: '', severity: '' });
  const [assets, setAssets] = useState([]); // State for dropdown options

  useEffect(() => {
    // Fetch assets for the dropdown
    axios.get('${ApiUrl}/api/assets')
      .then(response => {
        setAssets(response.data);
      })
      .catch(error => console.error('Error fetching assets:', error));

    if (location.state && location.state.procedure) {
      // When editing an existing procedure
      setFormData(location.state.procedure);
    } else {
      // For new procedure, set default createdBy to current user ID (Replace with actual user name if available)
      axios.get('${ApiUrl}/api/users/669b86da74088e9469ed9ac7') // Fetch user details if needed
        .then(response => {
          setFormData(prevData => ({
            ...prevData,
            createdBy: response.data.name || 'User Name' // Use actual user name here
          }));
        })
        .catch(error => console.error('Error fetching user details:', error));
    }
  }, [location.state]);

  const handleEditorChange = (content) => {
    setFormData(prevData => ({
      ...prevData,
      content: content || ''
    }));
  };

  const handleSubmit = () => {
    if (!formData.procedureName || !formData.content) {
      setNotification({
        message: 'Please fill in all required fields.',
        severity: 'error'
      });
      return;
    }
    
    const request = formData._id
      ? axios.put(`${ApiUrl}/api/procedures/${formData._id}`, formData)
      : axios.post('${ApiUrl}/api/procedures', formData);
  
    request
      .then(response => {
        setNotification({
          message: 'Procedure saved successfully.',
          severity: 'success'
        });
        setTimeout(() => {
          navigate("/procedure");
        }, 2000); // Delay navigation to show the success message
      })
      .catch(error => {
        console.error('Error saving procedure:', error);
        setNotification({
          message: 'Failed to save procedure. Check the console for details.',
          severity: 'error'
        });
      });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {formData._id ? 'Edit Procedure' : 'New Procedure'}
      </Typography>
      {notification.message && (
        <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
          <Alert severity={notification.severity}>{notification.message}</Alert>
        </Stack>
      )}
      <Grid container spacing={2}>
        {/* Disabled Fields */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Procedure ID"
                value={formData._id || 'Procedure ID'} // Display Procedure ID
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Created By"
                value={formData.createdBy || 'User Name'} // Display user name
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Created On"
                value={new Date().toISOString().split('T')[0]} // Display today's date
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Editable Fields */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Procedure Name"
            value={formData.procedureName}
            onChange={(e) => setFormData({ ...formData, procedureName: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Asset</InputLabel>
            <Select
              value={formData.assetId}
              onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
              displayEmpty
            >
              <MenuItem value="">None</MenuItem>
              {assets.map((asset) => (
                <MenuItem key={asset._id} value={asset._id}>
                  {asset.assetName} {/* Display asset name */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Editor
            apiKey='q2yws6m7pph5gmrsgwrzp1w0i1rnrvs702bdhigr8tpm4qzf'
            init={{
              plugins: 'anchor autolink charmap codesample emoticons image code link lists media searchreplace table visualblocks wordcount',
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | code align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
              tinycomments_mode: 'embedded',
              tinycomments_author: 'Author name',
              mergetags_list: [
                { value: 'First.Name', title: 'First Name' },
                { value: 'Email', title: 'Email' },
              ],
              ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
            }}
            value={formData.content || ''}
            onEditorChange={handleEditorChange}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'right' }}>
          <Button variant='contained' onClick={handleSubmit}>
            {formData._id ? 'Update Procedure' : 'Create Procedure'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Newprocedure;
