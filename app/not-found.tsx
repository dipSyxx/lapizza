'use client'

import React, { Suspense } from 'react'
import { InfoBlock } from '@/components/shared/info-block'

// This component will use useSearchParams safely inside a Suspense boundary
const NotFoundContent = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <InfoBlock
        title="Page Not Found"
        text="The page you are looking for does not exist"
        imageUrl="/assets/images/not-found.png"
        className="mb-6"
      />
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
}
