/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import React from 'react'
import { LoginForm } from './forms/login-form'
import { RegisterForm } from './forms/register-form'
import { Dialog } from '@/components/ui'
import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface Props {
  open: boolean
  onClose: () => void
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
  const [type, setType] = React.useState<'login' | 'register'>('login')

  const onSwitchType = () => {
    setType(type === 'login' ? 'register' : 'login')
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[450px] bg-white p-10">
        <VisuallyHidden>
          <DialogTitle>Auth</DialogTitle>
          <DialogDescription>Login or register to your account</DialogDescription>
        </VisuallyHidden>
        {type === 'login' ? <LoginForm onClose={handleClose} /> : <RegisterForm onClose={handleClose} />}

        <hr />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              signIn('github', {
                callbackUrl: '/',
                redirect: true,
              })
            }
            type="button"
            className="gap-2 h-12 p-2 flex-1 border-0 bg-primary/10 hover:bg-primary/20"
          >
            <img className="w-6 h-6" src="https://github.githubassets.com/favicons/favicon.svg" />
            GitHub
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              signIn('google', {
                callbackUrl: '/',
                redirect: true,
              })
            }
            type="button"
            className="gap-2 h-12 p-2 flex-1 border-0 bg-primary/10 hover:bg-primary/20"
          >
            <img className="w-6 h-6" src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" />
            Google
          </Button>
        </div>

        <Button variant="outline" onClick={onSwitchType} type="button" className="h-12 hover:bg-primary/20">
          {type !== 'login' ? 'Login' : 'Register'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
