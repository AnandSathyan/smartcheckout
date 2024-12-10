import React, { useState, useEffect } from 'react';

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    // Create a WebSocket connection to the backend
    const ws = new WebSocket('ws://localhost:4000'); // WebSocket URL from the Node.js server

    // Handle incoming messages (barcode data from the scanner)
    ws.onmessage = (event) => {
      const barcode = event.data;
      console.log('Received barcode:', barcode);
      setScannedData(barcode); // Update state with scanned barcode
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Clean up WebSocket connection when the component unmounts
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
