import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Xie Bao Crab House - Mobile Review Generator',
  description: 'Mobile-optimized QR code scanning and AI review generation for Xie Bao Crab House',
  keywords: ['mobile', 'QR code', 'Google Reviews', 'Xie Bao Crab House', 'seafood restaurant'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
}

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <div className="h-full overflow-auto">
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
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
        </div>
      </body>
    </html>
  )
}