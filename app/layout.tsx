import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Header } from '@/components/shared'
import './globals.css'
import { Providers } from '@/components/shared/providers'

const nunito = Nunito({
  subsets: ['cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Lapizza | Home',
  description:
    'Lapizza - online service for ordering pizza and other dishes with the ability to choose ingredients, sizes and types of pizza. Convenient authorization through GitHub and Google.',
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <main className="min-h-screen">
          <Providers>
            <Header />
            {children} {modal}
          </Providers>
        </main>
      </body>
    </html>
  )
}
