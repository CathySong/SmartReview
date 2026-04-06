import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Review Generator',
  description: 'Mobile review generator for restaurant reviews',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
}

export default function MobileSimpleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 2000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '14px',
              padding: '12px 16px',
              borderRadius: '8px',
              maxWidth: '90vw',
            },
          }}
        />
      </body>
    </html>
  )
}