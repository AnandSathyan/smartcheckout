"use client"

import React, { useState, useEffect, useRef } from "react"
import { Trash2, CreditCard, X, Barcode, ChevronUp, ChevronDown, Globe } from 'lucide-react'
import { Button } from "../../components/ui/Button/Button"
import { Input } from "../../components/ui/Input/Input"
import { ScrollArea } from "../../components/ui/ScrollArea/ScrollArea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/Dropdown/DropdownMenu"
import { useNavigate } from "react-router-dom"
import BarcodeScannerComponent from "react-qr-barcode-scanner"
import { fetchProductInfo } from "../../lib/api"
import { Product } from "../../types/Product"
import onScan from 'onscan.js'
//@ts-ignore
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from "react-redux"
import { setLanguage } from "../../redux/languageSlice"
import { usePasswordProtectedAction } from "../../hooks/useMasterPasswordAction"
import { Toaster, toast } from 'react-hot-toast'
import ScreenKeyboard from "../../components/ui/ScreenKeyBoard/ScreenKeyBoard"

import { AnyMxRecord } from "dns"

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
  const navigate = useNavigate()
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Load saved products from local storage
    // const savedProducts = localStorage.getItem('scannedProducts');
    // if (savedProducts) {
    //   setProducts(JSON.parse(savedProducts));
    // }
    const savedProducts = localStorage.getItem('scannedProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    // Load saved language from local storage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguages(savedLanguage);
      dispatch(setLanguage(savedLanguage));
      
    }
  }, []);

  // useEffect(() => {
  //   // Save products to local storage whenever it changes
  //   localStorage.setItem('scannedProducts', JSON.stringify(products));
  // }, [products]);

  useEffect(() => {
    if (isScanning && scannerRef.current) {
      scannerRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isScanning])

  useEffect(() => {
    onScan.attachTo(document, {
      suffixKeyCodes: [13],
      reactToPaste: true,
      onScan: function(sScanned: string, iQuantity: number) {
        handleDetected(sScanned);
      },
      onScanError: function(oDebug: any) {
        console.error('Scan error:', oDebug);
      }
    });

    const handleInput = (e: Event) => {
      const inputElement = e.target as HTMLInputElement;
      const currentTime = Date.now();
      
      if (currentTime - lastInputTime > 50) {
        scannedCode = inputElement.value;
      } else {
        scannedCode += inputElement.value.slice(-1);
      }
      
      lastInputTime = currentTime;
      
      if (scannedCode.length > 5) {
        handleDetected(scannedCode);
        scannedCode = '';
        inputElement.value = '';
      }
    };

    const inputElement = document.getElementById('ean_input') as HTMLInputElement;
    if (inputElement) {
      inputElement.addEventListener('input', handleInput);
    }

    return () => {
      onScan.detachFrom(document);
      if (inputElement) {
        inputElement.removeEventListener('input', handleInput);
      }
    };
  }, []);

  const handleEanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEan(e.target.value);
    scannedCode = '';
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
    const productInfo = await fetchProductInfo(code, "1", "1")

    setProducts(prevProducts => {
      const existingProductIndex = prevProducts.findIndex(product => product.code === code)
      
      let updatedProducts;
      if (existingProductIndex !== -1) {
        updatedProducts = prevProducts.map((product, index) =>
          index === existingProductIndex
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      } else {
        const newProduct: Product = {
          id: Date.now(),
          code,
          //@ts-ignore
          name: productInfo?.product_name || `${t("Product")} ${prevProducts.length + 1}`,
          price: 1.00,
          //@ts-ignore
          kcal: productInfo?.nutriments['energy-kcal'] || 0,
          quantity: 1,
        }
        updatedProducts = [...prevProducts, newProduct];
      }
      
      // Save to localStorage immediately
      localStorage.setItem('scannedProducts', JSON.stringify(updatedProducts));
      return updatedProducts;
    })
  }

  const handleAddProduct = () => {
    addProduct(ean)
  }

  const removeProduct = (id: number) => {
    openModal('removeOne', id)
  }

  const handlePriceChange = (id: number, price: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, price } : product
    ))
  }

  const clearItems = () => {
    openModal('clearAll')
  }

  const totalPrice = products.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const totalKcal = products.reduce((sum, product) => sum + product.kcal * product.quantity, 0)
  const itemCount = products.length

  const helpVideos: HelpVideo[] = [
    { id: 1, title: t("How to scan items"), duration: "2:30" , videoUrl: "/video/AdobeStock_427154101_Video_HD_Preview.mov"},
    { id: 2, title: t("Using coupons"), duration: "3:45"  , videoUrl: "/video/AdobeStock_514688104_Video_HD_Preview.mov"},
  ]
  
  const handleLanguageChange = (lang: string) => {
    setLanguages(lang)
    if(lang == 'عربي'){
      lang = "Arabic"
    }
    dispatch(setLanguage(lang))
  };

  const {
    isOpen,
    password,
    error,
    openModal,
    closeModal,
    setPassword,
    handleSubmit,
    actionType,
    audioRef,
  } = usePasswordProtectedAction('1')

  const handlePayment = () => {
    if (products.length === 0) {
      toast.error(t("Please add items before proceeding to payment."), {
        duration: 3000,
        position: 'top-center',
      });
      if (audioRef.current) {
        audioRef.current.play()
      }
    } else {
      toast.success(t("Proceeding to payment..."), {
        duration: 3000,
        position: 'top-center',
      });
    }
  }

  return (
    <div className="h-screen bg-blue-50 flex flex-col overflow-hidden">
      <header className="bg-[#002868] text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="https://www.pegasustech.net/image/catalog/pegasus-logob.png"
              alt="Pegasus Logo"
              className="h-10 bg-white p-1 rounded cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>
          <h1 className="text-2xl font-bold hidden sm:block">{t("Easy Self-Checkout")}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-blue-700">
                <Globe className="w-4 h-4 mr-2" />
                {languages}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleLanguageChange('English')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('عربي')}>عربي</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <section className="w-full md:w-1/2 p-2 flex flex-col h-full overflow-hidden">
          <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col h-full">
            <div className="flex space-x-2 mb-2">
              <Input
                id="ean_input"
                type="text"
                placeholder={t("Scan or enter item")}
                value={ean}
                onChange={handleEanChange}
                className="flex-grow text-base"
              />
              <Button onClick={handleScan} className="bg-[#002868] hover:bg-green-600 text-white text-base px-4">
                <Barcode className="mr-2 h-4 w-4" /> {t("Scan")}
              </Button>
              <Button onClick={handleAddProduct} className="bg-[#002868] hover:bg-green-600 text-white text-base px-4">
                {t("Add")}
              </Button>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{t("Scanned Items")} ({itemCount})</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#002868]"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              <ScrollArea className="flex-grow h-[calc(100vh-300px)]">
                <div className="space-y-2">
                  {products.slice(isExpanded ? 0 : -4).map((product) => (
                    <div key={product.id} className="flex justify-between items-center bg-blue-100 p-2 rounded-lg">
                      <span className="text-base">{product.name} x{product.quantity}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 text-right text-sm">KWD {product.price.toFixed(2)}</div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeProduct(product.id)}
                          className="h-6 w-6 text-[#002868] hover:text-blue-800 hover:bg-blue-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center text-lg font-bold mb-2">
                <span>{t("Total")}</span>
                <span>KWD {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-base mb-2">
                <span>{t("Total Calories:")}</span>
                <span>{totalKcal.toFixed(2)} {t("kcal")}</span>
              </div>
              <div className="flex space-x-2">
                <Button onClick={clearItems} variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-300 text-base py-2">
                  <Trash2 className="mr-2 h-4 w-4" /> {t("Clear All")}
                </Button>
                <Button onClick={handlePayment} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-base py-2">
                  <CreditCard className="mr-2 h-4 w-4" /> {t("Pay Now")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/2 p-2 bg-blue-50 overflow-hidden">
          <div className="bg-white rounded-lg shadow-lg p-2 h-full flex flex-col">
            <h2 className="text-lg font-bold mb-2">{t("Helpful Resources")}</h2>
            <div className="flex-grow overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 mb-2">
                <div className="w-full h-[50vh] bg-gray-300 rounded-lg flex items-center justify-center">
                  <video 
                    className="w-full h-full rounded-lg object-cover" 
                    src={currentVideo}
                    autoPlay 
                    muted 
                  ></video>
                </div>
              </div>

              <h3 className="text-base font-semibold mb-2">{t("How-to Videos")}</h3>
              <ScrollArea className="h-[calc(100vh-400px)]">
                <ul className="space-y-2">
                  {helpVideos.map((video) => (
                    <li key={video.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg cursor-pointer" onClick={() => setCurrentVideo(video.videoUrl)}>
                      <span className="text-sm">{video.title}</span>
                      <span className="text-xs text-gray-600">{video.duration}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <Button className="w-full bg-[#002868] hover:bg-blue-700 text-white text-base py-2">
                {t("Need More Help?")}
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-2">
              {actionType === 'clearAll' ? t("Enter Master Password") : t("Confirm Item Removal")}
            </h2>
            <p className="mb-2 text-sm">
              {actionType === 'clearAll'
                ? t("Please enter the master password to clear all items.")
                : t("Please enter the master password to remove this item.")}
            </p>
            <Input
              type="password"
              value={password}
              onChange={(e: { target: { value: any } }) => setPassword(e.target.value)}
              className="w-full mb-2"
              placeholder={t("Password")}
              readOnly
            />
            {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
            <ScreenKeyboard
              onKeyPress={(key: any) => setPassword((prev: any) => prev + key)}
              onBackspace={() => setPassword((prev:any) => prev.slice(0, -1))}
              onClear={() => setPassword('')}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={closeModal} variant="outline" className="text-sm">
                {t("Cancel")}
              </Button>
              <Button
                onClick={() =>
                  handleSubmit(
                    () => {
                      setProducts([]);
                      localStorage.setItem('scannedProducts', JSON.stringify([]));
                    },
                    (id: any) => {
                      const updatedProducts = products.filter((product) => product.id !== id);
                      setProducts(updatedProducts);
                      localStorage.setItem('scannedProducts', JSON.stringify(updatedProducts));
                    }
                  )
                }
                className="text-sm"
              >
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
              width={300}
              height={300}
              onUpdate={(err, result) => {
                if (result) {
                  handleDetected(result.getText());
                }
              }}
            />
            <Button onClick={() => setIsScanning(false)} className="mt-2 w-full text-sm">
              {t("Close Scanner")}
            </Button>
          </div>
        </div>
      )}
      <audio ref={audioRef} src="/Audio/beep-warning-6387.mp3" preload="auto"></audio>
      <Toaster />
      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        {t("© 2024 Pegasus Self-Checkout. All rights reserved.")}
      </footer>
    </div>
  )
}

