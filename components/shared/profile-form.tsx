/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { TFormRegisterValues, formRegisterSchema } from './modals/auth-modal/forms/schemas'
import { User } from '@prisma/client'
import toast from 'react-hot-toast'
import { signOut } from 'next-auth/react'
import { FormInput } from './form'
import { Button } from '../ui'
import { updateUserInfo } from '@/app/actions'
import { Container } from './Container'
import { Title } from './Title'
import Link from 'next/link'
import { Server } from 'lucide-react'

interface Props {
  data: User
}

export const ProfileForm: React.FC<Props> = ({ data }) => {
  const form = useForm({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      await updateUserInfo({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      })

      toast.error('Data updated 📝', {
        icon: '✅',
      })
    } catch (error) {
      return toast.error('Error updating data', {
        icon: '❌',
      })
    }
  }

  const onClickSignOut = () => {
    signOut({
      callbackUrl: '/',
    })
  }

  return (
    <Container className="my-10">
      <div className="flex items-center gap-8">
        <Title text={`Personal Information | #${data.fullName}-${data.role}`} size="md" className="font-bold" />
        {data.role === 'ADMIN' && (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-base text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Server size={18} />
            Admin Dashboard
          </Link>
        )}
      </div>

      <FormProvider {...form}>
        <form className="flex flex-col gap-5 w-96 mt-10" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput name="email" label="E-Mail" required />
          <FormInput name="fullName" label="Full Name" required />

          <FormInput type="password" name="password" label="New Password" required />
          <FormInput type="password" name="confirmPassword" label="Confirm Password" required />

          <Button disabled={form.formState.isSubmitting} className="text-base mt-10" type="submit">
            Save
          </Button>

          <Button
            onClick={onClickSignOut}
            variant="secondary"
            disabled={form.formState.isSubmitting}
            className="text-base"
            type="button"
          >
            Sign Out
          </Button>
        </form>
      </FormProvider>
    </Container>
  )
}
