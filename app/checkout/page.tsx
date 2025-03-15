'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Container, Title } from '@/components/shared'

import { CheckoutFormValues, checkoutFormSchema } from '@/constants'
import { createOrder } from '@/app/actions'
import toast from 'react-hot-toast'
import React, { Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { Api } from '@/services/api-client'
import { useCart } from '@/hooks'
import { CheckoutCart, CheckoutPersonalForm, CheckoutAddressForm } from '@/components/shared/checkout'
import { CheckoutSidebar } from '@/components/shared/checkout-sidebar'

// Компонент-заглушка для Suspense
const LoadingFallback = () => <div className="animate-pulse p-4">Loading...</div>

export default function CheckoutPage() {
  const [submitting, setSubmitting] = React.useState(false)
  const { totalAmount, updateItemQuantity, items, removeCartItem, loading } = useCart()
  const { data: session } = useSession()

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      comment: '',
    },
  })

  React.useEffect(() => {
    async function fetchUserInfo() {
      const data = await Api.auth.getMe()
      const [firstName, lastName] = data.fullName.split(' ')

      form.setValue('firstName', firstName)
      form.setValue('lastName', lastName)
      form.setValue('email', data.email)
    }

    if (session) {
      fetchUserInfo()
    }
  }, [form, session])

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true)

      const url = await createOrder(data)

      toast.error('Order successfully placed! 📝 Redirecting to payment... ', {
        icon: '✅',
      })

      if (url) {
        location.href = url
      }
    } catch (err) {
      console.log(err)
      setSubmitting(false)
      toast.error('Failed to create order', {
        icon: '❌',
      })
    }
  }

  const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
    const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1
    updateItemQuantity(id, newQuantity)
  }

  return (
    <Container className="mt-10">
      <Title text="Checkout" className="font-extrabold mb-8 text-[36px]" />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-10">
            {/* Left side */}
            <div className="flex flex-col gap-10 flex-1 mb-20">
              <Suspense fallback={<LoadingFallback />}>
                <CheckoutCart
                  onClickCountButton={onClickCountButton}
                  removeCartItem={removeCartItem}
                  items={items}
                  loading={loading}
                />

                <CheckoutPersonalForm className={loading ? 'opacity-40 pointer-events-none' : ''} />

                <CheckoutAddressForm className={loading ? 'opacity-40 pointer-events-none' : ''} />
              </Suspense>
            </div>

            {/* Right side */}
            <div className="w-[450px]">
              <Suspense fallback={<LoadingFallback />}>
                <CheckoutSidebar totalAmount={totalAmount} loading={loading || submitting} />
              </Suspense>
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  )
}
