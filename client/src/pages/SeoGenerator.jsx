import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  useTheme,
  Chip,
  Stack,
} from '@mui/material';
import {
  Code as CodeIcon,
  ContentCopy as ContentCopyIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import axios from 'axios';

const SeoGenerator = () => {
  const theme = useTheme();
  const [productId, setProductId] = useState('');
  const [description, setDescription] = useState('');
  const [jsonLd, setJsonLd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!productId.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setJsonLd('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/seo/generate', {
        product_id: productId,
        description,
      });
      setJsonLd(response.data.json_ld);
    } catch (err) {
      setError('Failed to generate SEO data. Please try again later.');
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonLd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInject = async () => {
    const res = await fetch("http://localhost:5000/install_script_tag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop: "mystore.myshopify.com" }),
    });
  
    const data = await res.json();
    alert("ScriptTag Installed: " + JSON.stringify(data));
  };

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
            <CodeIcon fontSize="large" color="primary" />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight="bold" color="primary.dark">
              AI SEO JSON-LD Generator
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Generate structured data markup to improve your product's search engine visibility
            </Typography>
          </Grid>
          <Grid item>
            <Chip 
              icon={<LightbulbIcon />} 
              label="AI Powered" 
              color="primary" 
              variant="outlined" 
              sx={{ fontWeight: 'medium' }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              height: '100%',
              boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)',
              border: `1px solid ${theme.palette.grey[200]}`,
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                transform: 'translateY(-2px)'
              }
            }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Input Details
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Enter your product information to generate optimized JSON-LD markup.
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Product ID"
                  variant="outlined"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  margin="normal"
                  placeholder="Enter your product identifier"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                  required
                />

                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Product Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  margin="normal"
                  placeholder="Provide a detailed description of your product"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                  required
                  helperText="More detailed descriptions yield better results"
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerate}
                  disabled={loading}
                  fullWidth
                  size="large"
                  sx={{ 
                    mt: 3, 
                    borderRadius: 1.5,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CodeIcon />}
                >
                  {loading ? 'Generating...' : 'Generate JSON-LD'}
                </Button>

                <Button variant="contained" onClick={handleInject}>
                  Inject JSON-LD into Store
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              height: '100%',
              boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)',
              border: `1px solid ${theme.palette.grey[200]}`,
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
                transform: 'translateY(-2px)'
              }
            }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Generated JSON-LD
                </Typography>
                {jsonLd && (
                  <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                    <IconButton onClick={copyToClipboard} size="small" color={copied ? "success" : "default"}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2, 
                    borderRadius: 1.5,
                    '& .MuiAlert-icon': { alignItems: 'center' }
                  }}
                >
                  {error}
                </Alert>
              )}

              {!jsonLd && !error && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 8,
                    px: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'grey.300'
                  }}
                >
                  <InfoIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1" color="text.secondary" align="center">
                    Your generated JSON-LD will appear here
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1, maxWidth: 450 }}>
                    Fill in the product details and click "Generate JSON-LD" to create structured data for your product
                  </Typography>
                </Box>
              )}

              {jsonLd && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    bgcolor: 'grey.50',
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    maxHeight: '500px',
                    overflow: 'auto'
                  }}
                >
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    wordWrap: 'break-word',
                    margin: 0,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>
                    {jsonLd}
                  </pre>
                </Paper>
              )}

              {jsonLd && (
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip 
                    size="small" 
                    label="SEO Optimized" 
                    color="success" 
                    variant="outlined"
                  />
                  <Chip 
                    size="small" 
                    label="Schema.org Compatible" 
                    color="primary" 
                    variant="outlined"
                  />
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SeoGenerator;
