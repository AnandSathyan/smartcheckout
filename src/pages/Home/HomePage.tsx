"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe, ChevronDown, ShoppingBasket, CreditCard, CheckCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/Dropdown/DropdownMenu"
import { Button } from "../../components/ui/Button/Button"
import { useNavigate } from "react-router-dom"
//@ts-ignore
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage } from "../../redux/languageSlice"

export default function SelfCheckout() {
  const currentLanguage = useSelector((state: any) => state.language.language)
  const navigate = useNavigate()
  const [languages, setLanguages] = useState(currentLanguage)
  const [activeStep, setActiveStep] = useState(0)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleClick = (step: any) => {
    if (step.title === t("Scan Items")) {
      navigate('Scan')
    }
    else{
      console.log("else magellan")
      navigate('Magellan')
    }
  }

  const steps = [
    {
      title: t("Scan Items"),
      icon: <ShoppingBasket className="w-6 h-6" />,
      description: t("Use the scanner to add your items"),
    },
    {
      title: t("Pay"),
      icon: <CreditCard className="w-6 h-6" />,
      description: t("Choose your payment method"),
    },
    {
      title: t("Done"),
      icon: <CheckCircle className="w-6 h-6" />,
      description: t("Collect your receipt and items"),
    },
  ]

  const handleLanguageChange = (lang: string) => {
    setLanguages(lang)
    if(lang == 'عربي'){
      lang = "Arabic"
    }
    dispatch(setLanguage(lang))

  }

  return (
    <div className="h-screen bg-gradient-to-b from-red-50 to-white flex flex-col overflow-hidden">
      <header className="bg-red-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="https://www.pegasustech.net/image/catalog/pegasus-logob.png"
              alt="Pegasus Logo"
              className="h-10 bg-white p-1 rounded"
            />
          </div>
            <h1 className="text-2xl font-bold hidden sm:block">{t("Easy Self-Checkout")}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-red-700">
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

      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        <div className="md:w-1/2 space-y-4 overflow-y-auto pr-4">
          <div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">
              {t("Easy Self-Checkout")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("Complete your purchase quickly and easily")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className={`cursor-pointer bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 ${
                  activeStep === index 
                    ? " relative after:absolute after:inset-0 after:border-2 after:border-red-500 after:rounded-lg" 
                    : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleClick(step)}
              >
                <div className="p-4 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    activeStep === index ? "bg-red-500 text-white" : "bg-red-100 text-red-500"
                  }`}>
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg border border-red-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-red-600 mb-4">{t("Next Step:")}</h2>
            <p className="text-xl mb-6">{steps[activeStep].description}</p>
            <Button
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xl py-6 px-8 rounded-lg shadow-md transition-colors duration-300"
              onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
            >
              {activeStep === steps.length - 1 ? t("Finish Checkout") : `${t('Start')} ${steps[activeStep].title}`}
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="md:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://img.freepik.com/free-photo/close-up-view-measuring-weight-fruit-supermarket_342744-1102.jpg?w=1060"
            alt="Self-checkout station"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 to-transparent flex flex-col justify-end p-6">
            <div className="text-white space-y-2">
              <p className="text-3xl font-bold">{t("Today's Special Offer")}</p>
              <p className="text-xl">{t("15% off orders over $200")}</p>
              <p className="text-sm opacity-80">
                {t("*Limited time offer. See store for details.")}
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        {t("© 2024 Pegasus Self-Checkout. All rights reserved.")}
      </footer>
    </div>
  )
}

