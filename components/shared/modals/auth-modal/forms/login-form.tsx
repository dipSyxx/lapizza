/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { TFormLoginValues, formLoginSchema } from './schemas'
import { FormInput } from '../../../form'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { Title } from '@/components/shared/Title'
import { zodResolver } from '@hookform/resolvers/zod'
interface Props {
  onClose?: VoidFunction
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const resp = await signIn('credentials', {
        ...data,
        redirect: false,
      })

      if (!resp?.ok) {
        throw Error()
      }

      toast.success('You have successfully logged in', {
        icon: '✅',
      })

      onClose?.()
    } catch (error) {
      console.log('Error [LOGIN]', error)
      toast.error('Unable to login', {
        icon: '❌',
      })
    }
  }

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center">
          <div className="mr-2">
            <Title text="Login" size="md" className="font-bold" />
            <p className="text-gray-400">Enter your email to login to your account</p>
          </div>
          <img src="/assets/images/phone-icon.png" alt="phone-icon" width={60} height={60} />
        </div>

        <FormInput name="email" label="E-Mail" required />
        <FormInput name="password" label="Password" type="password" required />

        <Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">
          Login
        </Button>
      </form>
    </FormProvider>
  )
}
