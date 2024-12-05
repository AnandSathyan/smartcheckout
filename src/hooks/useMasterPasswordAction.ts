import { useState } from 'react'

export function usePasswordProtectedAction(masterPassword: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const openModal = (val:any) => {
    setIsOpen(true)
    setPassword('')
    setError('')
  }

  const closeModal = () => {
    setIsOpen(false)
    setPassword('')
    setError('')
  }

  const handleSubmit = (onSuccess: () => void) => {
    if (password === masterPassword) {
      onSuccess()
      closeModal()
    } else {
      setError('Incorrect password')
    }
  }

  return {
    isOpen,
    password,
    error,
    openModal,
    closeModal,
    setPassword,
    handleSubmit,
  }
}




