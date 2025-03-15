'use client'
import { Container } from './Container'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SearchInput } from './Search-input'
import { AuthModal } from './modals'
import { ProfileButton } from './profile-button'
import { CartButton } from './cart-button'
import toast from 'react-hot-toast'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  hasSearch?: boolean
  hasCart?: boolean
  className?: string
}

export const Header: React.FC<Props> = ({ className }) => {
  const router = useRouter()
  const [openAuthModal, setOpenAuthModal] = React.useState(false)

  const searchParams = useSearchParams()

  React.useEffect(() => {
    let toastMessage = ''

    if (searchParams.has('paid')) {
      toastMessage = 'Order successfully paid! Information sent to email.'
    }

    if (searchParams.has('verified')) {
      toastMessage = 'Email successfully verified!'
    }

    if (toastMessage) {
      setTimeout(() => {
        router.replace('/')
        toast.success(toastMessage, {
          duration: 3000,
        })
      }, 1000)
    }
  }, [])

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

        <div className="mx-10 flex-1">
          <SearchInput />
        </div>

        <div className="flex items-center gap-3">
          <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          <CartButton />
        </div>
      </Container>
    </header>
  )
}
