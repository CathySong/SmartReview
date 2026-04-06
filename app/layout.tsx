import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuickReview - AI-Powered Google Review Generator',
  description: 'Scan QR code, get AI-generated review, submit 5-star Google review in one click',
  keywords: ['Google Reviews', 'QR Code', 'AI Review Generator', 'Customer Feedback'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-50">
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">QR</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">QuickReview</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">AI-Powered Google Reviews</span>
                </div>
              </div>
            </div>
          </nav>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-600 text-sm">
                <p>© 2024 QuickReview. All rights reserved.</p>
                <p className="mt-2">This tool helps businesses collect authentic customer reviews while maintaining regulatory compliance.</p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}