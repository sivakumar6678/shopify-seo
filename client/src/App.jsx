import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Toolbar, Box } from '@mui/material';
import SeoGenerator from './pages/SeoGenerator';
import LlmsManager from './pages/LlmsManager';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ScriptTagPage from './pages/ScriptTagPage';
import Sidebar from './components/Sidebar';
import AnalyticsPixel from './components/AnalyticsPixel';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box 
          sx={{ 
            display: 'flex',
            minHeight: '100vh',
            background: 'linear-gradient(180deg, rgba(249,250,252,1) 0%, rgba(240,242,245,1) 100%)',
            backgroundAttachment: 'fixed',
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <Sidebar />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: { xs: 2, sm: 3 },
              overflow: 'auto',
              position: 'relative',
              height: '100vh',
              overflowY: 'auto',
              '&::before': {
                content: '""',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(at 30% 20%, rgba(80, 72, 229, 0.03) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(16, 185, 129, 0.03) 0px, transparent 50%)',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                pointerEvents: 'none',
                zIndex: 0,
              }
            }}
          >
            <Toolbar />
            <Box sx={{ 
              position: 'relative', 
              zIndex: 1,
              minHeight: 'calc(100vh - 64px)', // Subtract toolbar height
            }}>
              <Routes>
                <Route path="/" element={<SeoGenerator />} />
                <Route path="/llms" element={<LlmsManager />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/script-tags" element={<ScriptTagPage />} />
                <Route path="/analytics-pixel" element={<AnalyticsPixel />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
