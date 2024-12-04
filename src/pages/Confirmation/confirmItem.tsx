"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe, ChevronDown, ChevronRight, Volume2, Search, HelpCircle, ArrowLeft, XCircle } from 'lucide-react'
import { Button } from "../../components/ui/Button/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/Dropdown/DropdownMenu"
import { Input } from "../..//components/ui/Input/Input"

interface CartItem {
  id: number
  name: string
  quantity: string
  unitPrice: number
  totalPrice: number
}

export default function ConfirmItem() {
  const [language, setLanguage] = useState("English")
  const [quantity, setQuantity] = useState(0)
  const [cartItems] = useState<CartItem[]>([
    { id: 1, name: "Banana", quantity: "1 kg", unitPrice: 4, totalPrice: 4 },
    { id: 2, name: "Cucumber", quantity: "250 g", unitPrice: 3, totalPrice: 1 },
    { id: 3, name: "Cilantro", quantity: "500 g", unitPrice: 6, totalPrice: 2 },
  ])

  const recommendedItems = [
    { name: "Pineapples", price: "20/kg", image: "https://w7.pngwing.com/pngs/9/79/png-transparent-pineapple-fruit-pineapple-pineapple-fruit-pineapple-clipart-thumbnail.png" },
    { name: "Chikoo", price: "9/kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf7h5e7w0O40qFRZkfyweCLIhKgztvS41XpQ&s" },
    { name: "Banana", price: "2/kg", image: "https://media.istockphoto.com/id/619046500/photo/bananas.jpg?s=612x612&w=0&k=20&c=p5-v1iKwhOhw5cFjfx83qgaZcOBSVpUuicZi4VIGF2Y=" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-[1fr_400px]">
        {/* Main Content */}
        <div className="p-8 bg-gradient-to-b from-red-50 to-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <img
                src="https://www.pegasustech.net/image/catalog/pegasus-logob.png"
                alt="Pegasus Logo"
                className="h-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {language}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLanguage("English")}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("Español")}>Español</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("Français")}>Français</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" className="gap-2">
                <HelpCircle className="w-4 h-4" />
                Help
              </Button>
            </div>
          </div>

          {/* Confirm Item Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <h1 className="text-3xl font-bold">Confirm your item...</h1>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Volume2 className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex gap-8">
              <img
                src="data:image/jpeg;base64,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"
                alt="Kashmiri Apple"
                className="rounded-lg w-[300px] h-[300px] object-cover"
              />
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Kashmiri Apple</h2>
                <p className="text-xl">1.5 Kg</p>
                <p className="text-3xl font-bold">$ 7</p>
                <div className="space-y-4">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Add to My Items
                  </Button>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-12 h-12 text-2xl border-red-500 text-red-500"
                      onClick={() => setQuantity(Math.max(0, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="text-2xl w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-12 h-12 text-2xl border-red-500 text-red-500"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Items */}
          <div>
            <h2 className="text-2xl font-bold mb-6">...you may also like</h2>
            <div className="flex gap-6">
              {recommendedItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>
              ))}
              <Button variant="ghost" size="icon" className="self-center">
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex gap-4 max-w-[800px] mx-auto">
              <Button variant="outline" className="flex-1 gap-2 border-red-500 text-red-500">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button variant="outline" className="flex-1 gap-2 border-red-500 text-red-500">
                <XCircle className="w-4 h-4" />
                Cancel Transaction
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="border-l border-red-200 p-6 bg-red-50">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                className="pl-10 pr-4 py-2 w-full"
                placeholder="Search for an item and enter quantity"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">My Items (3)</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-red-100">
                    <th className="p-2">Item</th>
                    <th className="p-2">Quantity<br/>(g or kg)</th>
                    <th className="p-2">Unit price<br/>($)</th>
                    <th className="p-2">Total price<br/>($)</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b border-red-200">
                      <td className="p-2">{item.id}. {item.name}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">$ {item.unitPrice}</td>
                      <td className="p-2">$ {item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span>$ 7</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Tax</span>
                <span>$ 0</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span>$ 7</span>
              </div>
              <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-6">
                Proceed to Pay $7
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

