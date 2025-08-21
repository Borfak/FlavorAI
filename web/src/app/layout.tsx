import Navbar from '@/components/layout/Navbar'
import { AuthProvider } from '@/contexts/AuthContext'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'FlavorAI - Smart Recipe Assistant',
    description: 'Discover and manage recipes with AI-powered features',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AuthProvider>
                    <Navbar />
                    <main>{children}</main>
                    <Toaster
                        position='bottom-right'
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#000',
                                color: '#fff',
                                border: '1px solid #333',
                                borderRadius: '8px',
                            },
                            className: 'sonner-toast',
                        }}
                        theme='dark'
                    />
                </AuthProvider>
            </body>
        </html>
    )
}
