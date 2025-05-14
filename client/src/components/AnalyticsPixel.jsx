import React, { useEffect } from 'react';
import axios from 'axios';

const AnalyticsPixel = ({ shopUrl }) => {
  useEffect(() => {
    const trackTraffic = async () => {
      try {
        await axios.get('http://localhost:5000/track', {
          params: { shop: shopUrl },
          headers: { 'User-Agent': navigator.userAgent }
        });
      } catch (error) {
        console.error("Error tracking traffic", error);
      }
    };

    trackTraffic();
  }, [shopUrl]);

  return null;  // This component does not render anything
};

export default AnalyticsPixel;
