"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 1
      })
    }, 20)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t-2 border-red-600"
        />
        <img
          src="https://www.pegasustech.net/image/catalog/pegasus-logob.png"
          alt="Pegasus Logo"
          className="h-24 relative z-10"
        />
      </motion.div>
      
      <div className="w-64 bg-gray-200 rounded-full h-2 mb-4">
        <motion.div
          className="bg-red-600 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-600 text-lg"
      >
        Loading...
      </motion.p>
    </div>
  )
}
