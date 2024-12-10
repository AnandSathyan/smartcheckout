import React from 'react'
import { Button } from '../Button/Button'
//@ts-ignore
import { useTranslation } from 'react-i18next'

interface ScreenKeyboardProps {
  onKeyPress: (key: string) => void
  onBackspace: () => void
  onClear: () => void
}

const ScreenKeyboard: React.FC<ScreenKeyboardProps> = ({ onKeyPress, onBackspace, onClear }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0']
  ]
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => onKeyPress(key)}
              className="w-full h-12 text-lg font-bold"
              variant="outline"
            >
              {key}
            </Button>
          ))}
          {rowIndex === keys.length - 1 && (
            <>
              <Button
                onClick={onBackspace}
                className="w-full h-12 text-lg font-bold"
                variant="outline"
              >
                ←
              </Button>
              <Button
                onClick={onClear}
                className="w-full h-12 text-lg font-bold"
                variant="outline"
              >
                {t('Clear')}
              </Button>
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default ScreenKeyboard

