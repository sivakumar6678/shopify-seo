import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Box,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SeoIcon from '@mui/icons-material/Search';
import CodeIcon from '@mui/icons-material/Code';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import JavascriptIcon from '@mui/icons-material/Javascript';

const drawerWidth = 260;

const menuItems = [
  { text: 'SEO Generator', path: '/', icon: <SeoIcon /> },
  { text: 'LLMs.txt Manager', path: '/llms', icon: <CodeIcon /> },
  { text: 'Analytics', path: '/analytics', icon: <BarChartIcon /> },
  { text: 'Script Tags', path: '/script-tags', icon: <JavascriptIcon /> },
  { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

export default function Sidebar() {
  const location = useLocation();
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        height: '100vh',
        position: 'relative',
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          position: 'relative',
          height: '100vh',
        },
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        px: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <StorefrontIcon color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          Shopify Tools
        </Typography>
      </Toolbar>
      
      <Box sx={{ 
        overflow: 'auto',
        height: 'calc(100vh - 64px)', // Subtract toolbar height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Box>
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              MAIN NAVIGATION
            </Typography>
          </Box>
          
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => {
              const isSelected = location.pathname === item.path;
              
              return (
                <ListItem
                  key={item.text}
                  component={Link}
                  to={item.path}
                  selected={isSelected}
                  disablePadding
                  sx={{
                    mb: 0.5,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    '&.Mui-selected': {
                      bgcolor: `${theme.palette.primary.main}15`,
                      '&:hover': {
                        bgcolor: `${theme.palette.primary.main}25`,
                      },
                    },
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1,
                      px: 2,
                      width: '100%',
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 40,
                        color: isSelected ? 'primary.main' : 'text.secondary'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="body1" 
                          color={isSelected ? 'primary.main' : 'text.primary'}
                          fontWeight={isSelected ? 'medium' : 'regular'}
                        >
                          {item.text}
                        </Typography>
                      } 
                    />
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Box>
        
        <Box>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              © 2024 Shopify Tools
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Version 1.0.0
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
