declare module 'onscan.js' {
    interface OnScanOptions {
      suffixKeyCodes?: number[];
      reactToPaste?: boolean;
      onScan: (scannedCode: string, quantity: number) => void;
      onScanError?: (error: any) => void;
    }
  
    interface OnScan {
      attachTo: (element: Document | HTMLElement, options: OnScanOptions) => void;
      detachFrom: (element: Document | HTMLElement) => void;
    }
  
    const onScan: OnScan;
    export default onScan;
  }
  
  