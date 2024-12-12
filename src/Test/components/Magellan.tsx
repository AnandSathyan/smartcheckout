import React, { useState, useEffect } from "react";
// import "./styles.css";
// import "./barcode.css";

const BarcodeScanning = () => {
  const [status, setStatus] = useState("Error.");
  const [symbology, setSymbology] = useState("&nbsp;");
  const [data, setData] = useState("&nbsp;");
  const SCAN_TIMEOUT = 10000;

  useEffect(() => {
    // Load barcode.js and keyboard.js scripts dynamically
    const barcodeScript = document.createElement("script");
    barcodeScript.src = "/js/barcode.js"; // Path to barcode.js in public folder
    barcodeScript.async = true;

    const keyboardScript = document.createElement("script");
    keyboardScript.src = "/js/keyboard.js"; // Path to keyboard.js in public folder
    keyboardScript.async = true;

    // Once both scripts are loaded, initialize scanning and keyboard management
    barcodeScript.onload = () => {
      keyboardScript.onload = () => {
        try {
          initProperties();

          // Initialize scanning and set up button functionality
          enableScanButton(true);
          if (!initScanning()) {
            //@ts-ignore
            document.getElementById("start").disabled = true;
          }
        } catch (e) {
          handleBarcodeError(e);
        }
      };
      document.body.appendChild(keyboardScript);
    };
    document.body.appendChild(barcodeScript);

    // Cleanup the scripts when the component unmounts
    return () => {
      document.body.removeChild(barcodeScript);
      document.body.removeChild(keyboardScript);
    };
  }, []);

  // Handles errors when a required library (DLBarcodeMgr or DLKeyboardMgr) is not loaded
   //@ts-ignore
  const handleBarcodeError = (e) => {
    if (e instanceof ReferenceError && e.message.includes("_DLBarcodeMgr")) {
      console.error("ERROR: DLBarcodeMgr not injected. Barcode scanning functions may not work as expected.");
      alert("Error: DLBarcodeMgr not detected. SDK calls may not work as expected.");
    }

    if (e instanceof ReferenceError && e.message.includes("_DLKeyboardMgr")) {
      console.error("ERROR: DLKeyboardMgr not injected. Keyboard functions may not work as expected.");
      alert("Error: DLKeyboardMgr not detected. SDK calls may not work as expected.");
    }
  };

  // Set the status message on the page
   //@ts-ignore
  const setStatusMessage = (message) => {
    setStatus(message);
  };

  // Enable or disable start and stop buttons
   //@ts-ignore
  const enableScanButton = (enable) => {
     //@ts-ignore
    document.getElementById("start").disabled = !enable;
     //@ts-ignore
    document.getElementById("stop").disabled = enable;
  };

  // Start scanning function
  const startScan = () => {
    setStatusMessage("Scanning started.");
    setSymbology("&nbsp;");
    setData("&nbsp;");
    enableScanButton(false);
     //@ts-ignore
    DLBarcodeMgr.startDecode(SCAN_TIMEOUT);
  };

  // Stop scanning function
  const stopScan = () => {
    setStatusMessage("Scanning stopped.");
    enableScanButton(true);
     //@ts-ignore
    DLBarcodeMgr.stopDecode();
  };

  // Initializes scanning and sets callbacks
  const initScanning = () => {
     //@ts-ignore
    if (!DLBarcodeMgr.isInitialized()) {
      setStatusMessage("Scanner not initialized!");
      return false;
    }
 //@ts-ignore
    if (!DLBarcodeMgr.onScan(scanCallback)) {
      setStatusMessage("Could not set the scan callback!");
      return false;
    }
 //@ts-ignore
    if (!DLBarcodeMgr.onTimeout(timeoutCallback)) {
         //@ts-ignore
      DLBarcodeMgr.ignoreScan();
      setStatusMessage("Could not set the timeout callback!");
      return false;
    }

    // Cleanup event listeners on unload
    window.addEventListener('unload', () => {
         //@ts-ignore
      DLBarcodeMgr.ignoreScan();
       //@ts-ignore
      DLBarcodeMgr.ignoreTimeout();
    });

    setStatusMessage("Initialized.");
    return true;
  };

  // Callback for scan result
   //@ts-ignore
  const scanCallback = (params) => {
     //@ts-ignore
    setSymbology(Object.keys(SymIds)[params.id]);
    setData(params.text);
    setStatusMessage("Barcode scanned.");
    enableScanButton(true);
  };

  // Callback for scan timeout
  const timeoutCallback = () => {
    setStatusMessage("Timeout occurred.");
    enableScanButton(true);
  };

  // Sets the scanner properties (disables wedge keyboard input)
  const initProperties = () => {
     //@ts-ignore
    DLBarcodeMgr.setProperty(BcdPropIds.WEDGE_KEYBOARD_ENABLE, false);

    
// Enable triggers on the keyboard (using DLKeyboardMgr from keyboard.js)
 //@ts-ignore
    const keyboardMgr = new DLKbdMgr();
    keyboardMgr.enableTriggers(true);
  };

  return (
    <div className="barcode-scanning">
      <center>
        <div className="banner">
          Visit datalogic.github.io/javascript/overview/ for full SDK documentation
        </div>
        <h2>Barcode Scanning</h2>
      </center>

      {/* Action buttons */}
      <center>
        <button className="action-button" id="start" onClick={startScan}>
          Start Scanning
        </button>
        <button className="action-button" id="stop" onClick={stopScan}>
          Stop Scanning
        </button>
      </center>

      {/* Status */}
      <hr />
      <div>
        <h3>Status:</h3>
        <div id="status">{status}</div>
      </div>
      <hr />

      {/* Barcode symbology data */}
      <div>
        <h3>Symbology:</h3>
        <div id="symbology" dangerouslySetInnerHTML={{ __html: symbology }}></div>
      </div>

      {/* Barcode data */}
      <div>
        <h3>Data:</h3>
        <div id="data" dangerouslySetInnerHTML={{ __html: data }}></div>
      </div>
    </div>
  );
};

export default BarcodeScanning;
