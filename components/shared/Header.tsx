'use client'
import { Container } from './Container'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '../ui'
import { ArrowRight, ShoppingCart, User } from 'lucide-react'

interface Props {
  hasSearch?: boolean
  hasCart?: boolean
  className?: string
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn('border-b border-gray-100', className)}>
      <Container className="flex items-center justify-between py-8">
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" width={35} height={35} alt="Logo" />
            <div>
              <h1 className="text-2xl uppercase font-black">Lapizza</h1>
              <h1></h1>
              <p className="text-sm text-gray-400 leading-3">It doesn`t get any better than this</p>
            </div>
          </div>
        </Link>
        <div className="flex flex-row align-center gap-3">
          <Button variant="outline" className="text-base font-bold flex flex-row gap-1">
            <User size={16} />
            Log in
          </Button>
          <Button className={cn('group relative', className)}>
            <b>0 $</b>
            <span className="h-full w-[1px] bg-white/30 mx-3" />
            <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
              <ShoppingCart size={16} className="relative" strokeWidth={2} />
              <b>0</b>
            </div>
            <ArrowRight
              size={20}
              className="absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
            />
          </Button>
        </div>
      </Container>
    </header>
  )
}
