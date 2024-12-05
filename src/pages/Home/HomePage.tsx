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
import {useTranslation} from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from "../../redux/languageSlice"
export default function SelfCheckout() {
  const currentLanguage = useSelector((state: any) => state.language.language);

    const navigate = useNavigate();
    const [languages, setLanguages] = useState(currentLanguage)
    const [activeStep, setActiveStep] = useState(0)
    const { t } = useTranslation();
    const handleClick = (steps:any) =>{
        // console.log("steps:",steps);
        if(steps.title == "Scan Items" ||steps.title == "مسح العناصر"){
            navigate('Scan')
        }

    }
    const steps = [
        {
            title: t("Scan Items"),
            icon: <ShoppingBasket className="w-8 h-8" />,
            description: t("Use the scanner to add your items"),
        },
        {
            title: t("Pay"),
            icon: <CreditCard className="w-8 h-8" />,
            description: t("Choose your payment method"),
        },
        {
            title: t("Done"),
            icon: <CheckCircle className="w-8 h-8" />,
            description: t("Collect your receipt and items"),
        },
    ]

    const dispatch = useDispatch();
  
    const handleLanguageChange = (lang: string) => {
      dispatch(setLanguage(lang)); // Update Redux state
     setLanguages(lang)
    };

  
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="container mx-auto px-4 py-6 flex-grow">
                <header className="flex justify-between items-center mb-8 bg-red-600 p-4 rounded-lg shadow-md">
                    <div className="flex items-center gap-2">
                        <img
                            src="https://www.pegasustech.net/image/catalog/pegasus-logob.png"
                            alt="Pegasus Logo"
                            className="h-12 bg-white p-2 rounded"
                        />

                    </div>
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
                            {/* <DropdownMenuItem onClick={() => setLanguage("Français")}>Français</DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-red-600">
                                {t("Easy Self-Checkout")}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {t("Complete your purchase quickly and easily")}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    className={`flex flex-col items-center text-center p-4 rounded-lg transition-colors ${activeStep === index ? "bg-red-100 border-2 border-red-500" : "bg-gray-100"
                                        }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={()=>handleClick(step)}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${activeStep === index ? "bg-red-500 text-white" : "bg-white text-red-500"
                                        }`}>
                                        {step.icon}
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                                    <p className="text-sm text-gray-600">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            className="bg-white p-6 rounded-lg shadow-lg border-2 border-red-500"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
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
                        className="relative rounded-2xl overflow-hidden z-99 shadow-lg h-full"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}

                    >
                        <img
              src="https://img.freepik.com/free-photo/close-up-view-measuring-weight-fruit-supermarket_342744-1102.jpg?t=st=1733229840~exp=1733233440~hmac=4c4846f77184a9490b10f8e535ac929233300b0fb519ef17204629ebd3fe2502&w=1060"
              alt="Self-checkout station"
              className="w-full h-full object-cover"
            />
                        {/* <iframe width="560" height="315" className="w-full h-full  z-1 object-cover" src="https://www.youtube.com/embed/RQ_VJ6LcXYc?si=w4nhPiRMkJX0zY7Y"  title="YouTube video player" frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen></iframe> */}
                        {/* <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 to-transparent flex flex-col justify-end p-6">
                            <div className="text-white space-y-2"> */}
                                {/* <p className="text-3xl font-bold">Today's Special Offer</p> */}
                                {/* <p className="text-xl">15% off orders over $200</p> */}
                                {/* <p className="text-sm opacity-80"> */}
                                {/* *Limited time offer. See store for details. */}
                                {/* </p> */}
                            {/* </div>
                        </div> */}
                    </motion.div>
                </div>
            </div>

            <footer className="bg-gray-100 py-4 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    {t("© 2024 Pegasus Self-Checkout. All rights reserved.")}
                </div>
            </footer>
        </div>
    )
}

