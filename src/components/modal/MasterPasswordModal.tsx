import React, { useState } from 'react'
import { Button } from "../../components/ui/Button/Button"
import { Input } from "../../components/ui/Input/Input"
import { X } from 'lucide-react'
//@ts-ignore
import { useTranslation } from 'react-i18next'

interface PasswordProtectedModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  action: string
}

export function PasswordProtectedModal({ isOpen, onClose, onConfirm, action }: PasswordProtectedModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { t } = useTranslation()

  const handleSubmit = () => {
    // Replace 'master123' with your actual master password or implement a more secure verification method
    if (password === 'master123') {
      onConfirm()
      onClose()
    } else {
      setError(t('Incorrect password'))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('Enter Master Password')}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <p className="mb-4">{t(`Please enter the master password to ${action}.`)}</p>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('Password')}
          className="mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>{t('Cancel')}</Button>
          <Button onClick={handleSubmit}>{t('Confirm')}</Button>
        </div>
      </div>
    </div>
  )
}
