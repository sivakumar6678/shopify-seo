import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import ScriptTagInjector from '../components/ScriptTagInjector';

const ScriptTagPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopify Script Tag Management
        </Typography>
        
        <Typography variant="body1" paragraph>
          Use this tool to inject JavaScript files into your Shopify store. 
          This allows you to add custom functionality without modifying your theme code.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <ScriptTagInjector />
        
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" gutterBottom>
            How Script Tags Work
          </Typography>
          
          <Typography variant="body2" paragraph>
            Script tags are a way to inject JavaScript into your Shopify store without modifying theme files.
            They are loaded on every page of your store and can be used to add custom functionality,
            tracking, or integrations with third-party services.
          </Typography>
          
          <Typography variant="body2" paragraph>
            When you inject a script tag, Shopify will load your JavaScript file on all pages of your store.
            The script is loaded with the "onload" event, which means it will execute after the page has finished loading.
          </Typography>
          
          <Typography variant="body2" paragraph>
            For security reasons, script tags must be served over HTTPS and must be publicly accessible.
            Additionally, your store must have an active session with this app for the script tag to be injected.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ScriptTagPage;