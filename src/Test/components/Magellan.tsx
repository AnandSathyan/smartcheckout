import React, { useState, useEffect } from 'react';

const MagellanScaleScanner = () => {
  const [scannedData, setScannedData] = useState(''); // To store barcode data
  const [weightData, setWeightData] = useState(''); // To store scale weight data

  // Simulate scale input (for testing, can be removed when actual scale is connected)
  const simulateScaleInput = () => {
    setWeightData('10.25 kg'); // Example scale weight
  };

  // Function to connect to the scale via the Web Serial API
  const connectScale = async () => {
    try {
        //@ts-ignore
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const reader = port.readable.getReader();
      const decoder = new TextDecoder();

      // Continuously read data from the scale
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        // Assuming scale sends weight data (e.g., "10.25 kg")
        setWeightData(text.trim());
      }
    } catch (error) {
      console.error('Error connecting to scale:', error);
    }
  };

  // Listen for barcode scanner input via keyboard
  const handleKeyDown = (event:any) => {
    // Barcode scanners generally send one character per keypress.
    // We are only interested in alphanumeric input and possibly Enter key to indicate the end of a scan
    if (event.key.length === 1) {
      // Add character to scanned data
      setScannedData((prev) => prev + event.key);
    }

    // When Enter is pressed, process the barcode
    if (event.key === 'Enter' && scannedData.length > 0) {
      console.log('Scanned Barcode:', scannedData);
      // Display scanned barcode in UI
      setScannedData(''); // Reset after processing
    }
  };

  useEffect(() => {
    // Attach keydown event listener for barcode scanner
    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [scannedData]);

  useEffect(() => {
    // Optionally simulate scale input every 5 seconds for testing (can be removed for actual scale)
    const scaleInterval = setInterval(simulateScaleInput, 5000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(scaleInterval);
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Magellan Scale Scanner</h2>
      <p>Scan a barcode and connect the scale to capture weight:</p>

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

      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          border: '1px solid #ccc',
          fontSize: '18px',
        }}
      >
        <strong>Weight:</strong> {weightData || 'Waiting for weight...'}
      </div>

      <button onClick={connectScale} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Connect to Scale
      </button>
    </div>
  );
};

export default MagellanScaleScanner;
