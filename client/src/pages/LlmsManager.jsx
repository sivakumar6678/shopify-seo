import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Alert,
  Tooltip,
  CircularProgress,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  ContentCopy as ContentCopyIcon,
  Link as LinkIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import axios from 'axios';

const LlmsManager = () => {
  const theme = useTheme();
  const [shopUrl, setShopUrl] = useState('');
  const [products, setProducts] = useState([{ title: '', url: '' }]);
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, { title: '', url: '' }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      const updated = [...products];
      updated.splice(index, 1);
      setProducts(updated);
    }
  };

  const generateLlms = async () => {
    if (!shopUrl.trim()) {
      setError('Please enter a shop URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/llms/generate', {
        shop_url: shopUrl,
        products,
      });
      setGeneratedText(response.data.content);
    } catch (err) {
      setError('Error generating llms.txt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              LLMs.txt Generator
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Create compliant LLMs.txt files for your Shopify store
            </Typography>
          </Grid>
          <Grid item>
            <Chip 
              icon={<ShoppingBagIcon />} 
              label="Shopify Compatible" 
              color="primary" 
              variant="outlined" 
              sx={{ fontWeight: 'medium' }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
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
                Store Information
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <TextField
                fullWidth
                label="Shop URL"
                variant="outlined"
                value={shopUrl}
                onChange={(e) => setShopUrl(e.target.value)}
                margin="normal"
                placeholder="https://your-store.myshopify.com"
                required
                InputProps={{
                  sx: { borderRadius: 1.5 },
                  startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />,
                }}
              />

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
                Product List
              </Typography>
              
              {products.map((p, i) => (
                <Box 
                  key={i} 
                  sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mb: 2,
                    alignItems: 'center' 
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label="Product Title"
                        variant="outlined"
                        value={p.title}
                        onChange={(e) => handleProductChange(i, 'title', e.target.value)}
                        InputProps={{
                          sx: { borderRadius: 1.5 }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Product URL"
                        variant="outlined"
                        value={p.url}
                        onChange={(e) => handleProductChange(i, 'url', e.target.value)}
                        InputProps={{
                          sx: { borderRadius: 1.5 }
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title="Remove product">
                        <IconButton 
                          onClick={() => removeProduct(i)}
                          disabled={products.length === 1}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={addProduct}
                sx={{ 
                  mt: 1, 
                  borderRadius: 1.5,
                  textTransform: 'none',
                }}
              >
                Add Product
              </Button>

              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={generateLlms}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CodeIcon />}
                  sx={{ 
                    borderRadius: 1.5,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? 'Generating...' : 'Generate llms.txt'}
                </Button>
              </Box>
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 3, 
                    borderRadius: 1.5,
                    '& .MuiAlert-icon': { alignItems: 'center' }
                  }}
                >
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
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
                  Generated llms.txt
                </Typography>
                {generatedText && (
                  <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                    <IconButton onClick={copyToClipboard} size="small" color={copied ? "success" : "default"}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />

              {!generatedText ? (
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
                    borderColor: 'grey.300',
                    height: '400px'
                  }}
                >
                  <CodeIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1" color="text.secondary" align="center">
                    Your generated llms.txt will appear here
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1, maxWidth: 450 }}>
                    Fill in your shop URL and product details, then click "Generate llms.txt"
                  </Typography>
                </Box>
              ) : (
                <Paper 
                  elevation={0} 
                  sx={{ 
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
                    {generatedText}
                  </pre>
                </Paper>
              )}
              
              {generatedText && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Place this file at the root of your Shopify store to help LLMs understand your product catalog.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LlmsManager;
