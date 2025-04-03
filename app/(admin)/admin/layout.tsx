import React from 'react'
import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/get-user-session'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check user authentication and role
  const session = await getUserSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/')
  }

  return <>{children}</>
}
