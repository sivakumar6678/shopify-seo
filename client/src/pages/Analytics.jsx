import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  TablePagination,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  SmartToy as BotIcon,
  Link as LinkIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Analytics = () => {
  const theme = useTheme();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get('http://localhost:5000/analytics');
      setAnalyticsData(response.data.logs || []);
      setError('');
    } catch (error) {
      console.error('Error fetching analytics data', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate summary statistics
  const totalVisits = analyticsData.length;
  const uniqueBots = [...new Set(analyticsData.map(entry => entry.llm_type))];
  const uniquePaths = [...new Set(analyticsData.map(entry => entry.path))];
  
  // Get counts by LLM type
  const botCounts = uniqueBots.map(bot => ({
    name: bot,
    count: analyticsData.filter(entry => entry.llm_type === bot).length
  })).sort((a, b) => b.count - a.count);

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
            <BarChartIcon fontSize="large" color="primary" />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight="bold" color="primary.dark">
              LLM Traffic Analytics
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Monitor and analyze LLM bot visits to your Shopify store
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={fetchAnalytics} 
                disabled={refreshing}
                sx={{ 
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': { bgcolor: 'background.paper' }
                }}
              >
                {refreshing ? 
                  <CircularProgress size={24} /> : 
                  <RefreshIcon />
                }
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
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
      ) : (
        <>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
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
                  <Box display="flex" alignItems="center" mb={2}>
                    <SearchIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Total Visits
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    {totalVisits}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Total LLM bot visits tracked
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
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
                  <Box display="flex" alignItems="center" mb={2}>
                    <BotIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Unique Bots
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    {uniqueBots.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Different LLM bots detected
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
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
                  <Box display="flex" alignItems="center" mb={2}>
                    <LinkIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Unique Paths
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    {uniquePaths.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Different pages visited by LLMs
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              mb: 4,
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
                Bot Distribution
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {botCounts.map((bot) => (
                  <Chip 
                    key={bot.name}
                    label={`${bot.name}: ${bot.count}`}
                    color="primary"
                    variant="outlined"
                    icon={<BotIcon />}
                    sx={{ fontWeight: 'medium' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

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
                Visit Log
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {analyticsData.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No analytics data available yet
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 1.5 }}>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>LLM Bot</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Path</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analyticsData
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((entry) => (
                            <TableRow key={entry.id} hover>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <BotIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                  {entry.llm_type}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <LinkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                  {entry.path}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                  {new Date(entry.timestamp).toLocaleString()}
                                </Box>
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={analyticsData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Analytics;
