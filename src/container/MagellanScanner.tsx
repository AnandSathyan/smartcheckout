import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/Button/Button'
import { toast } from 'react-hot-toast'

// Mock function to simulate connecting to the scanner
const connectToScanner = async (): Promise<boolean> => {
  // Simulate an API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  return Math.random() > 0.2 // 80% success rate
}

const MagellanScaleScanner: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const success = await connectToScanner()
      if (success) {
        setIsConnected(true)
        toast.success('Successfully connected to Magellan Scale Scanner')
      } else {
        toast.error('Failed to connect to Magellan Scale Scanner')
      }
    } catch (error) {
      console.error('Error connecting to scanner:', error)
      toast.error('Error connecting to Magellan Scale Scanner')
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    // You can add any initialization logic here
    // For example, checking if the scanner is already connected
  }, [])

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Magellan Scale Scanner</h3>
      <div className="flex items-center justify-between">
        <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        <Button
          onClick={handleConnect}
          disabled={isConnecting || isConnected}
          className={isConnected ? 'bg-green-600' : 'bg-blue-600'}
        >
          {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect'}
        </Button>
      </div>
    </div>
  )
}

export default MagellanScaleScanner
