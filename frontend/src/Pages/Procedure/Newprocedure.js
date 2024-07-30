import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Grid, Button } from '@mui/material';
import axios from 'axios';
import ExtractProcedure from './ExtractProcedure';

const Newprocedure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    procedureID: '',
    procedureName: '',
    department: 'Dept 1',
    laboratory: 'Lab 1',
    content: '',
    userId: '669b86da74088e9469ed9ac7'
  });

  useEffect(() => {
    if (location.state && location.state.procedure) {
      setFormData(location.state.procedure);
    } else {
      axios.get('http://localhost:8080/api/procedures/nextID')
        .then(response => {
          setFormData(prevData => ({
            ...prevData,
            procedureID: response.data.nextID
          }));
        })
        .catch(error => console.error('Error fetching next procedure ID:', error));
    }
  }, [location.state]);

  const handleEditorChange = (content) => {
    setFormData(prevData => ({
      ...prevData,
      content: content || ''
    }));
  };

  const handleExtractText = (text) => {
    setFormData(prevData => ({
      ...prevData,
      content: text || ''
    }));
  };

  const handleSubmit = () => {
    if (formData.procedureID) {
      axios.put(`http://localhost:8080/api/procedures/${formData.procedureID}`, formData)
        .then(response => {
          navigate("/procedure");
        })
        .catch(error => {
          console.error('Error saving procedure:', error);
          alert('Failed to save procedure. Check the console for details.');
        });
    } else {
      axios.post('http://localhost:8080/api/procedures', formData)
        .then(response => {
          navigate("/procedure");
        })
        .catch(error => {
          console.error('Error saving procedure:', error);
          alert('Failed to save procedure. Check the console for details.');
        });
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {formData.procedureID ? 'Edit Procedure' : 'New Procedure'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Procedure ID"
            value={formData.procedureID}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Procedure Name"
            value={formData.procedureName}
            onChange={(e) => setFormData({ ...formData, procedureName: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Department"
            value={formData.department}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Laboratory"
            value={formData.laboratory}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <ExtractProcedure onExtract={handleExtractText} />
          <Editor
            apiKey='q2yws6m7pph5gmrsgwrzp1w0i1rnrvs702bdhigr8tpm4qzf' // Use environment variable for API key
            init={{
              plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
              tinycomments_mode: 'embedded',
              tinycomments_author: 'Author name',
              mergetags_list: [
                { value: 'First.Name', title: 'First Name' },
                { value: 'Email', title: 'Email' },
              ],
              ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
            }}
            value={formData.content || ''} // Ensure this is a string
            onEditorChange={handleEditorChange}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'right' }}>
          <Button variant='contained' onClick={handleSubmit}>
            {formData.procedureID ? 'Update Procedure' : 'Create Procedure'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Newprocedure;
