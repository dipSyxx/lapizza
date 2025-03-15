import React from 'react'

interface Props {
  orderId: number
  totalAmount: number
  paymentUrl: string
}

export const PayOrderTemplate: React.FC<Props> = ({ orderId, totalAmount, paymentUrl }) => (
  <div>
    <h1>Order #{orderId}</h1>

    <p>
      Please pay your order amount of <b>{totalAmount} $</b>. Click <a href={paymentUrl}>this link</a> to pay for your
      order.
    </p>
  </div>
)
