"use client"

import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import SelfCheckout from '../pages/Home/HomePage'
import FullScreenScanner from '../pages/Scanner/Scanner'
import LoadingScreen from '../components/LoadingScreen/LoadingScreen'
import FullScreenScanners from '../Test/components/FullScreenScanner'
import FullScreenScannerDummy from '../Test/components/FullScreenScanner'
import { UserList } from '../api/ApiTest'

function NavigationContent() {
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // Simulating a 2-second load time

    return () => clearTimeout(timer)
  }, [location])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Routes >
      <Route path="/" element={<SelfCheckout />} />
      <Route path="/userList" element={<UserList />} />

 
  <Route path="/Scan" element={<FullScreenScanner/> } />

      {/* <Route path="/Scan" element={<FullScreenScanner />} /> */}
    </Routes>
  )
}

function Navigation() {
  return (
    <Router>
      <NavigationContent />
    </Router>
  )
}

export default Navigation
