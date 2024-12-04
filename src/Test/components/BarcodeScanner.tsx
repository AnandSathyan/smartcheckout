import React, { useState, useEffect, useRef } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import ProductTable from './ProductTable';
import { fetchProductInfo } from '../utils/api';
import { Product } from '../types/Product';
import styles from '../styles/BarcodeScanner.module.css';

export default function BarcodeScanner() {
  const [ean, setEan] = useState<string>('0');
  const [products, setProducts] = useState<Product[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScanning && scannerRef.current) {
      scannerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isScanning]);

  const handleEanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEan(e.target.value);
  };

  const handleScan = () => {
    setIsScanning(true);
  };

  const handleDetected = (result: string) => {
    setEan(result);
    setIsScanning(false);
    addProduct(result);
  };

  const addProduct = async (code: string) => {
    const productInfo = await fetchProductInfo(code);
    const newProduct: Product = {
      id: products.length + 1,
      code,
      name: productInfo?.product_name || `Product ${products.length + 1}`,
      price: 1.00,
      kcal: productInfo?.nutriments['energy-kcal'] || 0,
      quantity:2
    };
    setProducts([...products, newProduct]);
  };

  const handleAddProduct = () => {
    addProduct(ean);
  };

  const handleRemoveProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handlePriceChange = (id: number, price: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, price } : product
    ));
  };

  return (
    <section id="barcodescan" className={styles.container}>
      <div className={styles.row}>
        <h2>Price Calculator</h2>
        <hr className={styles.starPrimary} />
        <div className={styles.inputField}>
          <label htmlFor="ean_input">EAN:</label>
          <input
            id="ean_input"
            className={styles.ean}
            type="number"
            value={ean}
            onChange={handleEanChange}
          />
          <button className={styles.scanButton} onClick={handleScan}>
            <i className="fas fa-barcode"></i> SCAN
          </button>
          <button className={styles.addProductButton} onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
      </div>
      <div className={styles.row}>
        <ProductTable
          products={products}
          onRemoveProduct={handleRemoveProduct}
          onPriceChange={handlePriceChange}
        />
      </div>
      {isScanning && (
        <div ref={scannerRef} className={styles.overlay}>
          <div className={styles.overlayContent}>
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={(err, result) => {
                if (result) {
                  handleDetected(result.getText());
                }
              }}
            />
            <button className={styles.closeOverlay} onClick={() => setIsScanning(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

