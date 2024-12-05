"use client"

import React, { useState, useEffect, useRef } from "react"
import { Trash2, CreditCard, X, Barcode, ChevronUp, ChevronDown, PlayCircle, Globe } from 'lucide-react'
import { Button } from "../../components/ui/Button/Button"
import { Input } from "../../components/ui/Input/Input"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/Dropdown/DropdownMenu"
import { useNavigate } from "react-router-dom"
import BarcodeScannerComponent from "react-qr-barcode-scanner"
import { fetchProductInfo } from "../utils/api"
import { Product } from "../types/Product"
import onScan from 'onscan.js'
//@ts-ignore
import {useTranslation} from 'react-i18next'
import { useDispatch, useSelector } from "react-redux"
import { setLanguage } from "../../redux/languageSlice"
import { usePasswordProtectedAction } from "../../hooks/useMasterPasswordAction"

interface HelpVideo {
  id: number
  title: string
  duration: string
  videoUrl: string
}

export default function FullScreenScanner() {
  const currentLanguage = useSelector((state: any) => state.language.language);

  const [ean, setEan] = useState<string>('0')
  const [products, setProducts] = useState<Product[]>([])
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [languages, setLanguages] = useState(currentLanguage)
  const scannerRef = useRef<HTMLDivElement>(null)
  const [currentVideo, setCurrentVideo] = useState<string>("/video/AdobeStock_514688104_Video_HD_Preview.mov");
  let scannedCode = '';
  let lastInputTime = Date.now();
  const Navigate = useNavigate()
  const { t } = useTranslation();

  useEffect(() => {
    if (isScanning && scannerRef.current) {
      scannerRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isScanning])

  useEffect(() => {
    // Initialize onScan.js
    onScan.attachTo(document, {
      suffixKeyCodes: [13], // Enter key
      reactToPaste: true,
      onScan: function(sScanned: string, iQuantity: number) {
        console.log('Scanned with onScan.js: ', sScanned, 'Quantity: ', iQuantity);
        handleDetected(sScanned);
      },
      onScanError: function(oDebug: any) {
        console.log(oDebug);
      }
    });

    // USB scanner detection
    const handleInput = (e: Event) => {
      const inputElement = e.target as HTMLInputElement;
      const currentTime = Date.now();
      
      if (currentTime - lastInputTime > 50) {
        // If the delay between inputs is more than 50ms, assume it's a new scan
        scannedCode = inputElement.value;
      } else {
        // Otherwise, append to the existing scanned code
        scannedCode += inputElement.value.slice(-1);
      }
      
      lastInputTime = currentTime;
      
      // Check if the scanned code is complete (you may need to adjust this logic)
      if (scannedCode.length > 5) {
        console.log('Scanned with USB scanner:', scannedCode);
        handleDetected(scannedCode);
        scannedCode = '';
        inputElement.value = '';
      }
    };

    const inputElement = document.getElementById('ean_input') as HTMLInputElement;
    if (inputElement) {
      inputElement.addEventListener('input', handleInput);
    }

    // Cleanup function
    return () => {
      onScan.detachFrom(document);
      if (inputElement) {
        inputElement.removeEventListener('input', handleInput);
      }
    };
  }, []);

  const handleEanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEan(e.target.value);
    scannedCode = ''; // Reset scanned code on manual input
  }

  const handleScan = () => {
    setIsScanning(true)
  }

  const handleDetected = (result: string) => {
    setEan(result)
    setIsScanning(false)
    addProduct(result)
  }

  const addProduct = async (code: string) => {
    const productInfo = await fetchProductInfo(code)
  
    setProducts(prevProducts => {
      const existingProductIndex = prevProducts.findIndex(product => product.code === code)
      
      if (existingProductIndex !== -1) {
        // If product exists, increase the quantity
        return prevProducts.map((product, index) =>
          index === existingProductIndex
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      } else {
        // If it's a new product, add it to the list
        const newProduct: Product = {
          id: Date.now(),
          code,
          name: productInfo?.product_name || `Product ${prevProducts.length + 1}`,
          price: 1.00,
          kcal: productInfo?.nutriments['energy-kcal'] || 0,
          quantity: 1,
        }
        return [...prevProducts, newProduct]
      }
    })
  }

  const handleAddProduct = () => {
    addProduct(ean)
  }

  const removeProduct = (id: number) => {
    openModal(products.filter(product => product.id !== id))
    // setProducts(products.filter(product => product.id !== id))
  }

  const handlePriceChange = (id: number, price: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, price } : product
    ))
  }

  const clearItems = () => {
    // setProducts([])
    openModal([])
  }

  const totalPrice = products.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const totalKcal = products.reduce((sum, product) => sum + product.kcal * product.quantity, 0)
  const itemCount = products.length

  const helpVideos: HelpVideo[] = [
    { id: 1, title: t("How to scan items"), duration: "2:30" , videoUrl: "/video/AdobeStock_427154101_Video_HD_Preview (2).mov"},
    { id: 2, title: t("Using coupons"), duration: "3:45"  , videoUrl: "/video/AdobeStock_514688104_Video_HD_Preview.mov"},
    { id: 3, title: t("Payment methods"), duration: "4:15" , videoUrl: "/video/AdobeStock_660070776_Video_HD_Preview.mov" },
    { id: 4, title: t("Troubleshooting"), duration: "5:00" , videoUrl: "/video/AdobeStock_514688104_Video_HD_Preview.mov" },
  ]

  // Language Translation
  const dispatch = useDispatch();
  
  const handleLanguageChange = (lang: string) => {
    dispatch(setLanguage(lang)); // Update Redux state
    setLanguages(lang)
  };
  const {
    isOpen,
    password,
    error,
    openModal,
    closeModal,
    setPassword,
    handleSubmit,
  } = usePasswordProtectedAction('master123') 
  return (
    <div className="h-screen bg-red-50 flex flex-col">
      <header className="bg-red-600 text-white p-4 shadow-lg flex justify-between">
        <div onClick={()=>Navigate('/')} className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://www.pegasustech.net/image/catalog/pegasus-logob.png"
            alt="Pegasus Logo"
            className="h-12 bg-white p-2 rounded"
          />
        </div>
        <h1 className="text-3xl font-bold">{t("Self-Checkout Scanner")}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-red-700">
              <Globe className="w-4 h-4" />
              {languages}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleLanguageChange('English')}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange('عربي')}>عربي</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-grow flex flex-col md:flex-row">
        <section className="w-full md:w-1/2 p-4 flex flex-col h-full">
          <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full">
            <div className="flex space-x-2 mb-4">
              <Input
                id="ean_input"
                type="text"
                placeholder="Scan or enter item"
                value={ean}
                onChange={handleEanChange}
                className="flex-grow text-lg"
              />
              <Button onClick={handleScan} className="bg-red-600 hover:bg-red-700 text-white text-lg px-6">
                <Barcode className="mr-2 h-5 w-5" /> {t("Scan")}
              </Button>
              <Button onClick={handleAddProduct} className="bg-red-600 hover:bg-red-700 text-white text-lg px-6">
                {t("Add")}
              </Button>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">{t("Scanned Items")} ({itemCount})</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-red-600"
                >
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>

              <ScrollArea className="flex-grow">
                <div className="space-y-2">
                  {products.slice(isExpanded ? 0 : -4).map((product) => (
                    <div key={product.id} className="flex justify-between items-center bg-red-100 p-3 rounded-lg">
                      <span className="text-lg">{product.name} x{product.quantity}</span>
                      <div className="flex items-center space-x-4">
                        <div
                          
                          onChange={(e:any) => handlePriceChange(product.id, parseFloat(e.target.value))}
                          className="w-20 text-right"
                        >KWD {product.price}.00</div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeProduct(product.id)}
                          className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-200"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-2xl font-bold mb-4">
                <span>{t("Total")}</span>
                <span>KWD {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg mb-4">
                <span>{t("Total Calories:")}</span>
                <span>{totalKcal.toFixed(2)} {t("kcal")}</span>
              </div>
              <div className="flex space-x-4">
                <Button onClick={clearItems} variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-100 text-lg">
                  <Trash2 className="mr-2 h-5 w-5" /> {t("Clear All")}
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg py-6">
                  <CreditCard className="mr-2 h-6 w-6" /> {t("Pay Now")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/2 p-4 bg-red-50">
          <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4">{t("Helpful Resources")}</h2>
            <div className="flex-grow">
            <div className="aspect-w-16 aspect-h-9 mb-4">
  <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
    <video 
      className="w-full h-full rounded-lg" 
      src={currentVideo}
      autoPlay 
      muted 
      loop 
      controls   
    ></video>
  </div>
</div>

              <h3 className="text-xl font-semibold mb-2">{t("How-to Videos")}</h3>
              <ScrollArea className="h-64">
                <ul className="space-y-2">
                  {helpVideos.map((video) => (
                    <li key={video.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"  onClick={() => setCurrentVideo(video.videoUrl)}>
                      <span className="text-lg">{video.title}</span>
                      <span className="text-sm text-gray-600">{video.duration}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4">
                {t("Need More Help?")}
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4">{t("Enter Master Password")}</h2>
            <p className="mb-4">{t("Please enter the master password to clear all items.")}</p>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4"
              placeholder={t("Password")}
            />
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end space-x-4">
              <Button onClick={closeModal} variant="outline">
                {t("Cancel")}
              </Button>
              <Button onClick={() => handleSubmit(() => setProducts([]))}>
                {t("Submit")}
              </Button>
            </div>
          </div>
        </div>
      )}
      {isScanning && (
        <div ref={scannerRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={(err, result) => {
                if (result) {
                  handleDetected(result.getText());
                }
              }}
            />
            <Button onClick={() => setIsScanning(false)} className="mt-4 w-full">
              {t("Close Scanner")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

