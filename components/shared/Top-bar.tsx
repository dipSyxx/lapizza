import React from 'react'
import { Categories } from './Categories'
import { SortPopap } from './Sort-popap'
import { cn } from '@/lib/utils'
import { Container } from './Container'

interface Props {
  className?: string
}

export const TopBar: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('sticky top-[-1px] bg-white py-5 shadow-lg shadow-black/5 z-10', className)}>
      <Container className="flex items-center justify-between">
        <Categories />
        <SortPopap />
      </Container>
    </div>
  )
}
