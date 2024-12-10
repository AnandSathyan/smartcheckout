import React, { useState, useEffect } from 'react';

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState(''); // To store barcode data

  // Function to handle barcode scanner input (simulates keyboard input)
  const handleKeyDown = (event:any) => {
    // We only care about printable characters (barcode scanner typically sends these)
    if (event.key.length === 1) {
      // Add the scanned character to the scannedData state
      setScannedData((prev) => prev + event.key);
    }

    // When Enter is pressed, we consider the barcode as "scanned" and process it
    if (event.key === 'Enter' && scannedData.length > 0) {
      console.log('Scanned Barcode:', scannedData);
      // Here you can send the barcode to your backend or perform other actions
      alert(`Barcode scanned: ${scannedData}`);
      
      // Reset after processing
      setScannedData('');
    }
  };

  useEffect(() => {
    // Attach keydown event listener to capture barcode scanner input
    document.addEventListener('keydown', handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [scannedData]);

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

      <div>
        <p>Focus the window and scan a barcode.</p>
      </div>
    </div>
  );
};

export default BarcodeScanner;
