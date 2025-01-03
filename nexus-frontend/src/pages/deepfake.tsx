import React, { useState } from 'react';
import { Box, Button, Container, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DeepfakeDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://localhost:8000/detect-deepfake', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Deepfake Detection
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleImageSelect}
          />
          <label htmlFor="image-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Image
            </Button>
          </label>
          
          {selectedImage && (
            <Box sx={{ mt: 2 }}>
              <Typography>Selected: {selectedImage.name}</Typography>
              <img 
                src={URL.createObjectURL(selectedImage)} 
                alt="Preview" 
                style={{ maxWidth: '300px', marginTop: '10px' }}
              />
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!selectedImage || loading}
            sx={{ mt: 2, ml: 2 }}
          >
            Analyze
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {result && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6">Detection Results:</Typography>
            <Typography>
              {JSON.stringify(result, null, 2)}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DeepfakeDetection;
