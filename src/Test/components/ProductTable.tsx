import React from 'react';
import { Product } from '../types/Product';
import styles from '../styles/ProductTable.module.css';

interface ProductTableProps {
  products: Product[];
  onRemoveProduct: (id: number) => void;
  onPriceChange: (id: number, price: number) => void;
}

export default function ProductTable({ products, onRemoveProduct, onPriceChange }: ProductTableProps) {
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  const totalKcal = products.reduce((sum, product) => sum + product.kcal, 0);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Index</th>
            <th>Code</th>
            <th>Name</th>
            <th className={styles.textRight}>Price</th>
            <th>K-Cal</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td className={styles.textRight}>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => onPriceChange(product.id, parseFloat(e.target.value))}
                  className={styles.priceInput}
                />
              </td>
              <td>{product.kcal} kcal</td>
              <td>
                <button onClick={() => onRemoveProduct(product.id)} className={styles.removeButton}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={styles.total}>
            <td colSpan={3}></td>
            <td className={styles.textRight}>Total: {totalPrice.toFixed(2)}</td>
            <td>{totalKcal.toFixed(2)} kcal</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

