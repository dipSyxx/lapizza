'use client'

import React from 'react'

interface Props {
  onChange?: (value?: string) => void
}

export const AdressInput: React.FC<Props> = ({ onChange }) => {
  return (
    <div>
      <input type="text" onChange={(e) => onChange?.(e.target.value)} />
    </div>
  )
}
