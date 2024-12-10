import { useRef, useState } from 'react'
import { Product } from '../types/Product'
//@ts-ignore
import { useTranslation } from 'react-i18next'

export function usePasswordProtectedAction(masterPassword: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [actionType, setActionType] = useState<'clearAll' | 'removeOne'>('clearAll')
  const [itemToRemove, setItemToRemove] = useState<number | null>(null)
  const { t } = useTranslation();

  const openModal = (type: 'clearAll' | 'removeOne', itemId?: number) => {
    setIsOpen(true)
    setPassword('')
    setError('')
    setActionType(type)
    if (type === 'removeOne' && itemId !== undefined) {
      setItemToRemove(itemId)
    }
  }

  const closeModal = () => {
    setIsOpen(false)
    setPassword('')
    setError('')
    setItemToRemove(null)
  }

  const handleSubmit = (onClearAll: () => void, onRemoveOne: (id: number) => void) => {
    if (password === masterPassword) {
      if (actionType === 'clearAll') {
        onClearAll()
      } else if (actionType === 'removeOne' && itemToRemove !== null) {
        onRemoveOne(itemToRemove)
      }
      closeModal()
    } else {
      setError(t('Incorrect password'))
      if (audioRef.current) {
        audioRef.current.play()
      }
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
    audioRef,
    actionType,
  }
}

