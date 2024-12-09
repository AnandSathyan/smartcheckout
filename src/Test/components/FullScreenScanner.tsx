


  "use client"

  import { useState } from "react"
  import { Trash2, CreditCard, X, Barcode, ChevronUp, ChevronDown, PlayCircle,Globe } from 'lucide-react'
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

  interface ScannedItem {
    id: number
    name: string
    price: number
  }

  interface HelpVideo {
    id: number
    title: string
    duration: string
  }

  export default function FullScreenScanner() {
    const [scannedItems, setScannedItems] = useState<ScannedItem[]>([])
    const [currentItem, setCurrentItem] = useState("")
    const [isExpanded, setIsExpanded] = useState(false)
    const [language, setLanguage] = useState("English")
    const Navigation = useNavigate()
    const addItem = () => {
      if (currentItem.trim() !== "") {
        const newItem: ScannedItem = {
          id: Date.now(),
          name: currentItem,
          price: Math.floor(Math.random() * 100) + 1, // Random price for demonstration
        }
        setScannedItems([...scannedItems, newItem])
        setCurrentItem("")
      }
    }

    const removeItem = (id: number) => {
      setScannedItems(scannedItems.filter(item => item.id !== id))
    }

    const clearItems = () => {
      setScannedItems([])
    }

    const totalPrice = scannedItems.reduce((sum, item) => sum + item.price, 0)
    const itemCount = scannedItems.length

    const helpVideos: HelpVideo[] = [
      { id: 1, title: "How to scan items", duration: "2:30" },
      { id: 2, title: "Using coupons", duration: "3:45" },
      { id: 3, title: "Payment methods", duration: "4:15" },
      { id: 4, title: "Troubleshooting", duration: "5:00" },
    ]

    return (
      <div className="h-screen bg-red-50 flex flex-col">
        <header className="bg-red-600 text-white p-4 shadow-lg flex justify-between">
        <div onClick={()=>Navigation('/')} className="flex items-center gap-2">
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
                              <DropdownMenuItem onClick={() => setLanguage("Arabic ")}>Arabic </DropdownMenuItem>
                              {/* <DropdownMenuItem onClick={() => setLanguage("Français")}>Français</DropdownMenuItem> */}
                          </DropdownMenuContent>
                      </DropdownMenu>
        </header>

        <main className="flex-grow flex flex-col md:flex-row">
          <section className="w-full md:w-1/2 p-4 flex flex-col h-full">
            <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full">
              <div className="flex space-x-2 mb-4">
                <Input
                  type="text"
                  placeholder="Scan or enter item"
                  value={currentItem}
                  onChange={(e) => setCurrentItem(e.target.value)}
                  className="flex-grow text-lg"
                />
                <Button onClick={addItem} className="bg-red-600 hover:bg-red-700 text-white text-lg px-6">
                  <Barcode className="mr-2 h-5 w-5" /> Add
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
                    {scannedItems.slice(isExpanded ? 0 : -3).map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-red-100 p-3 rounded-lg">
                        <span className="text-lg">{item.name}</span>
                        <div className="flex items-center space-x-4">
                          <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
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
      </div>
    )
  }
