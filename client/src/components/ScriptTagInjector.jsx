import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import apiService from '../services/api';

const ScriptTagInjector = () => {
  // State for form inputs
  const [shop, setShop] = useState('');
  const [scriptUrl, setScriptUrl] = useState('');
  
  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!shop) {
      setAlert({
        open: true,
        message: 'Please enter a store URL',
        severity: 'error'
      });
      return;
    }
    
    if (!scriptUrl) {
      setAlert({
        open: true,
        message: 'Please enter a script URL',
        severity: 'error'
      });
      return;
    }
    
    // Format shop URL if needed
    let formattedShop = shop;
    if (!formattedShop.includes('.myshopify.com')) {
      formattedShop = `${formattedShop}.myshopify.com`;
    }
    
    // Remove https:// if present
    formattedShop = formattedShop.replace(/^https?:\/\//, '');
    
    setLoading(true);
    
    try {
      // Send request to backend using our API service
      const response = await apiService.injectScriptTag({
        shop: formattedShop,
        script_url: scriptUrl
      });
      
      setAlert({
        open: true,
        message: 'Script tag successfully injected!',
        severity: 'success'
      });
      
      // Optional: Clear form after successful submission
      // setShop('');
      // setScriptUrl('');
      
    } catch (error) {
      console.error('Error injecting script tag:', error);
      
      setAlert({
        open: true,
        message: error.response?.data?.error || 'Failed to inject script tag. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle alert close
  const handleAlertClose = () => {
    setAlert({
      ...alert,
      open: false
    });
  };
  
  // Handle copy script URL to clipboard
  const handleCopyScriptUrl = () => {
    navigator.clipboard.writeText(scriptUrl);
    setAlert({
      open: true,
      message: 'Script URL copied to clipboard!',
      severity: 'info'
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Script Tag Injector
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        This tool allows you to inject a JavaScript file into your Shopify store using Shopify's ScriptTag API.
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="shop"
          label="Shopify Store URL"
          name="shop"
          autoComplete="off"
          value={shop}
          onChange={(e) => setShop(e.target.value)}
          placeholder="your-store.myshopify.com"
          helperText="Enter your Shopify store URL (e.g., your-store.myshopify.com)"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="store url help"
                  edge="end"
                  title="Your Shopify store URL (myshopify.com domain)"
                >
                  <HelpOutlineIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="scriptUrl"
          label="Script URL"
          name="scriptUrl"
          autoComplete="off"
          value={scriptUrl}
          onChange={(e) => setScriptUrl(e.target.value)}
          placeholder="https://example.com/script.js"
          helperText="Enter the full URL to your JavaScript file"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="copy script url"
                  edge="end"
                  onClick={handleCopyScriptUrl}
                  title="Copy script URL"
                >
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            The script will be loaded on all pages of your store.
          </Typography>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 1, mb: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Inject Script'}
          </Button>
        </Box>
      </Box>
      
      {/* Information box */}
      <Paper 
        variant="outlined" 
        sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: 'rgba(66, 165, 245, 0.05)',
          borderColor: 'primary.light'
        }}
      >
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Important Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • The script will be loaded with the "onload" event<br />
          • Your store must have an active session with this app<br />
          • The script URL must be publicly accessible and served over HTTPS<br />
          • Changes may take a few minutes to appear on your store
        </Typography>
      </Paper>
      
      {/* Alert/Snackbar for feedback */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleAlertClose} 
          severity={alert.severity} 
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ScriptTagInjector;