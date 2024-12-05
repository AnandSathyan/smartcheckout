import React from 'react';
import logo from './logo.svg';
import './App.css';
import SelfCheckout from './pages/Home/HomePage';
import ScannerPage from './pages/Scanner/Scanner';
import ConfirmItem from './pages/Confirmation/confirmItem';
import FullScreenScanner from './pages/Scanner/Scanner';
import Navigation from './routing/Navigation';
import BarcodeScanner from './Test/components/BarcodeScanner';
import { Provider } from 'react-redux';
import store from './redux/store';
function App() {
  return (
    <Provider store={store}>
    <Navigation/>
    </Provider>
  );
}

export default App;
