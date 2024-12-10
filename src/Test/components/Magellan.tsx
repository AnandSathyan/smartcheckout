import React, { useState, useEffect } from 'react';

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    // WebSocket URL should point to your Vercel API route
    const ws = new WebSocket('ws://https://backend-demo-nine-gamma.vercel.app//api/websocket'); // WebSocket URL pointing to the API route

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const barcode = event.data;
      console.log('Received barcode:', barcode);
      setScannedData(barcode); // Update state with scanned barcode
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Magellan Barcode Scanner</h2>
      <p>Scan a barcode below:</p>

      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          border: '1px solid #ccc',
          fontSize: '18px',
        }}
      >
        <strong>Scanned Barcode:</strong> {scannedData || 'Waiting for scan...'}
      </div>
    </div>
  );
};

export default BarcodeScanner;
