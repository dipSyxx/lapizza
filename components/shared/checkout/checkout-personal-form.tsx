import React from 'react'
import { FormInput } from '../form'
import { WhiteBlock } from '../white-block'

interface Props {
  className?: string
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
  return (
    <WhiteBlock title="2. Personal Information" className={className}>
      <div className="grid grid-cols-2 gap-5">
        <FormInput name="firstName" className="text-base" placeholder="First name" />
        <FormInput name="lastName" className="text-base" placeholder="Last name" />
        <FormInput name="email" className="text-base" placeholder="E-Mail" />
        <FormInput name="phone" className="text-base" placeholder="Phone" />
      </div>
    </WhiteBlock>
  )
}
