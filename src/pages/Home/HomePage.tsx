"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Globe, ChevronDown, ShoppingBasket, Search, User, ArrowRight } from 'lucide-react'
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
  const { t, i18n } = useTranslation()
  const currentLanguage = useSelector((state: any) => state.language.language)
  const navigate = useNavigate()
  const [languages, setLanguages] = useState(currentLanguage)
  const [activeStep, setActiveStep] = useState(0)
  const [activeBox, setActiveBox] = useState("")
  const dispatch = useDispatch()

  useEffect(() => {
    const initializeLanguage = async () => {
      await i18n.changeLanguage(currentLanguage.toLowerCase());
      setLanguages(currentLanguage);
      setActiveBox(t("Start Scanning"));
    };

    initializeLanguage();
  }, [currentLanguage, i18n, t]);

  useEffect(() => {
    setActiveBox(t("Start Scanning"))
  }, [languages, t])

  const handleClick = (step: any) => {
    setActiveBox(step.title)
    if (step.title === t("Scan Items")) {
      setActiveStep(0)
      setTimeout(() => {
        navigate('Scan')
      }, 500)
    } else if (step.title === t("Check Price")) {
      setActiveStep(1)
    } else {
      setActiveStep(2)
    }
  }

  const steps = [
    {
      title: t("Scan Items"),
      icon: <ShoppingBasket className="w-8 h-8" />,
      description: t("Use the scanner to add your items"),
    },
    {
      title: t("Check Price"),
      icon: <Search className="w-8 h-8" />,
      description: t("Verify item prices"),
    },
    {
      title: t("User Info"),
      icon: <User className="w-8 h-8" />,
      description: t("Manage your account"),
    },
  ]

  const handleLanguageChange = async (lang: string) => {
    let normalizedLang = lang === 'عربي' ? 'ar' : lang.toLowerCase();
    setLanguages(lang)
    dispatch(setLanguage(lang))
    await i18n.changeLanguage(normalizedLang)
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-[#002868] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="https://www.pegasustech.net/image/catalog/pegasus-logob.png"
              alt="Pegasus Logo"
              className="h-12 bg-white p-2 rounded"
            />
          </div>
          <h1 className="text-3xl font-bold hidden sm:block">{t("Easy Self-Checkout")}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-white border-white hover:bg-[#003c8c]">
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

      <main className="flex-grow flex flex-col md:flex-row">
        <div className="w-1/2 p-4 bg-white">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-[#002868] mb-4">
              {t("Hey there!")}
            </h2>
            <p className="text-2xl text-gray-600">
              {t("Self-checkout is now easy!")}
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className={`cursor-pointer bg-white rounded-lg overflow-hidden ${
                  activeStep === index 
                    ? "ring-2 ring-[#002868]" 
                    : "border border-gray-200"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleClick(step)}
              >
                <div className="p-6 flex items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-6 ${
                    activeStep === index ? "bg-[#002868] text-white" : "bg-[#FFD700] text-[#002868]"
                  }`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#002868] mb-1">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="w-full bg-[#002868] hover:bg-[#003c8c] text-white text-xl py-8 rounded-lg shadow-lg transition-colors duration-300"
              onClick={() => handleClick(steps[activeStep])}
            >
              {activeBox} <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </motion.div>
        </div>

        <div className="w-1/2 relative">
          <img
            src="https://img.freepik.com/free-photo/close-up-view-measuring-weight-fruit-supermarket_342744-1102.jpg?w=1060"
            alt="Self-checkout station"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002868]/90 to-transparent flex flex-col justify-end p-8">
            <div className="bg-[#FFD700] text-[#002868] p-6 rounded-lg shadow-lg max-w-md">
              <p className="text-2xl font-bold mb-2">{t("Today's Special Offer")}</p>
              <p className="text-xl font-semibold mb-1">{t("15% off orders over $200")}</p>
              <p className="text-sm opacity-80">
                {t("*Limited time offer. See store for details.")}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#002868] py-4 text-center text-white text-sm">
        {t("© 2024 Pegasus Self-Checkout. All rights reserved.")}
      </footer>
    </div>
  )
}

