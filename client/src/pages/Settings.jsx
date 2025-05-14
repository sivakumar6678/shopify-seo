import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Paper,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Key as KeyIcon,
  AutoFixHigh as AutoFixIcon,
  Info as InfoIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Settings() {
  const theme = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [autoSeo, setAutoSeo] = useState(false);
  const [autoLlms, setAutoLlms] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/settings');
      setApiKey(res.data.gemini_api_key || '');
      setAutoSeo(res.data.auto_generate_seo);
      setAutoLlms(res.data.auto_generate_llms);
    } catch (err) {
      console.error(err);
      setError('Failed to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.post('http://localhost:5000/settings', {
        gemini_api_key: apiKey,
        auto_generate_seo: autoSeo,
        auto_generate_llms: autoLlms,
      });
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: `linear-gradient(120deg, ${theme.palette.primary.light}20 0%, ${theme.palette.primary.main}10 100%)`,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${theme.palette.grey[200]}`,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <SettingsIcon fontSize="large" color="primary" />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight="bold" color="primary.dark">
              Application Settings
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Configure your Shopify tools and AI integration preferences
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  API Configuration
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <TextField
                    label="Gemini API Key"
                    fullWidth
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    variant="outlined"
                    placeholder="Enter your Gemini API key"
                    type="password"
                    required
                    InputProps={{
                      sx: { borderRadius: 1.5 },
                      startAdornment: <KeyIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Your API key is required for AI-powered features
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  bgcolor: 'info.main', 
                  color: 'info.contrastText',
                  p: 2,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 3,
                }}>
                  <InfoIcon sx={{ mr: 1.5, mt: 0.2 }} />
                  <Typography variant="body2">
                    You can get a Gemini API key from the Google AI Studio. 
                    The key is stored securely and only used for generating content.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Automation Settings
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AutoFixIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      Automatic Generation
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Enable or disable automatic content generation features
                  </Typography>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 1.5, 
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 2,
                  }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={autoSeo} 
                          onChange={() => setAutoSeo(!autoSeo)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1">Auto Generate SEO</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Automatically generate JSON-LD for new products
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={autoLlms} 
                          onChange={() => setAutoLlms(!autoLlms)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1">Auto Generate LLMs.txt</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Keep LLMs.txt updated with new products
                          </Typography>
                        </Box>
                      }
                      sx={{ display: 'flex', alignItems: 'flex-start' }}
                    />
                  </Box>
                </Box>
                
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 1.5,
                      '& .MuiAlert-icon': { alignItems: 'center' }
                    }}
                  >
                    {error}
                  </Alert>
                )}
                
                {success && (
                  <Alert 
                    severity="success" 
                    icon={<CheckIcon />}
                    sx={{ 
                      mb: 3, 
                      borderRadius: 1.5,
                      '& .MuiAlert-icon': { alignItems: 'center' }
                    }}
                  >
                    {success}
                  </Alert>
                )}
                
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={saveSettings}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ 
                    borderRadius: 1.5,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Settings;
