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

interface HelpVideo {
  id: number
  title: string
  duration: string
}

export default function FullScreenScanner() {
  const [ean, setEan] = useState<string>('0')
  const [products, setProducts] = useState<Product[]>([])
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [language, setLanguage] = useState("English")
  const scannerRef = useRef<HTMLDivElement>(null)
  let scannedCode = '';
  let lastInputTime = Date.now();
  const Navigate = useNavigate()

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
    const newProduct: Product = {
      id: products.length + 1,
      code,
      name: productInfo?.product_name || `Product ${products.length + 1}`,
      price: 1.00,
      kcal: productInfo?.nutriments['energy-kcal'] || 0,
      quantity: 1, // Initialize with quantity as 1
    }

    // Check if the product already exists in the list
    const existingProduct = products.find(product => product.code === code)

    if (existingProduct) {
      // If product exists, increase the quantity
      setProducts(products.map(product =>
        product.code === code
          ? { ...product, quantity: product.quantity + 1 }
          : product
      ))
    } else {
      // Otherwise, add the new product to the list
      setProducts([...products, newProduct])
    }
  }

  const handleAddProduct = () => {
    addProduct(ean)
  }

  const removeProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const handlePriceChange = (id: number, price: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, price } : product
    ))
  }

  const clearItems = () => {
    setProducts([])
  }

  const totalPrice = products.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const totalKcal = products.reduce((sum, product) => sum + product.kcal * product.quantity, 0)
  const itemCount = products.length

  const helpVideos: HelpVideo[] = [
    { id: 1, title: "How to scan items", duration: "2:30" },
    { id: 2, title: "Using coupons", duration: "3:45" },
    { id: 3, title: "Payment methods", duration: "4:15" },
    { id: 4, title: "Troubleshooting", duration: "5:00" },
  ]

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
        <h1 className="text-3xl font-bold">Self-Checkout Scanner</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-red-700">
              <Globe className="w-4 h-4" />
              {language}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setLanguage("English")}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Arabic")}>Arabic</DropdownMenuItem>
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
                <Barcode className="mr-2 h-5 w-5" /> Scan
              </Button>
              <Button onClick={handleAddProduct} className="bg-red-600 hover:bg-red-700 text-white text-lg px-6">
                Add
              </Button>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Scanned Items ({itemCount})</h2>
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
                      <span className="text-lg">{product.name}</span>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="number"
                          value={product.price}
                          onChange={(e) => handlePriceChange(product.id, parseFloat(e.target.value))}
                          className="w-20 text-right"
                        />
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
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg mb-4">
                <span>Total Calories:</span>
                <span>{totalKcal.toFixed(2)} kcal</span>
              </div>
              <div className="flex space-x-4">
                <Button onClick={clearItems} variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-100 text-lg">
                  <Trash2 className="mr-2 h-5 w-5" /> Clear All
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg py-6">
                  <CreditCard className="mr-2 h-6 w-6" /> Pay Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/2 p-4 bg-red-50">
          <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Helpful Resources</h2>
            <div className="flex-grow">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-40 w-16 text-gray-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">How-to Videos</h3>
              <ScrollArea className="h-64">
                <ul className="space-y-2">
                  {helpVideos.map((video) => (
                    <li key={video.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-lg">{video.title}</span>
                      <span className="text-sm text-gray-600">{video.duration}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4">
                Need More Help?
              </Button>
            </div>
          </div>
        </section>
      </main>

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
              Close Scanner
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

