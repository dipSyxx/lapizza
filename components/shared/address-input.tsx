'use client'

import React from 'react'

interface Props {
  onChange?: (value?: string) => void
}

export const AdressInput: React.FC<Props> = ({ onChange }) => {
  return (
    <div>
      <input
        className="w-full border border-gray-300 rounded-md p-2"
        type="text"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}
