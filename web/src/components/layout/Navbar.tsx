'use client'

import LoginModal from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'
import Tooltip from '@/components/ui/Tooltip'
import { useAuth } from '@/contexts/AuthContext'
import { ChefHat, Menu, X } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import  { useState, useEffect } from 'react'

export default function Navbar() {
    const { user, logout } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    useEffect(() => {
        const open = () => setShowLoginModal(true)
        window.addEventListener('open-login-modal', open)
        return () => window.removeEventListener('open-login-modal', open)
    }, [])

    return (
        <motion.nav
            className='border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95'
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className='w-full px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16 max-w-7xl mx-auto'>
                    <div className='flex items-center'>
                        <Link href='/' className='flex items-center space-x-3 group'>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                                className='p-2 bg-black rounded-xl'
                            >
                                <ChefHat className='h-6 w-6 text-white' />
                            </motion.div>
                            <span className='text-xl font-bold text-gray-900 group-hover:text-black transition-colors'>
                                FlavorAI
                            </span>
                        </Link>
                    </div>

                    <div className='hidden md:flex items-center space-x-8'>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link
                                href='/recipes'
                                className='text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors'
                            >
                                All Recipes
                            </Link>
                        </motion.div>
                        {user && (
                            <>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link
                                        href='/recipes/my-recipes'
                                        className='text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors'
                                    >
                                        My Recipes
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    {user ? (
                                        <Link
                                            href='/recipes/add'
                                            className='bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
                                        >
                                            Add Recipe
                                        </Link>
                                    ) : (
                                        <Tooltip content='Please login to add recipes'>
                                            <button
                                                className='bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-60 cursor-not-allowed'
                                                disabled
                                            >
                                                Add Recipe
                                            </button>
                                        </Tooltip>
                                    )}
                                </motion.div>
                                <div className='flex items-center space-x-4'>
                                    <motion.button
                                        onClick={logout}
                                        className='text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors'
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Logout
                                    </motion.button>
                                </div>
                            </>
                        )}
                        {!user && (
                            <div className='flex items-center space-x-4'>
                                <motion.button
                                    onClick={() => setShowLoginModal(true)}
                                    className='text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors'
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Login
                                </motion.button>
                                <motion.button
                                    onClick={() => setShowRegisterModal(true)}
                                    className='bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Sign Up
                                </motion.button>
                            </div>
                        )}
                    </div>

                    <div className='md:hidden flex items-center'>
                        <motion.button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className='text-gray-700 hover:text-black p-2'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <motion.div
                                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isMenuOpen ? (
                                    <X className='h-6 w-6' />
                                ) : (
                                    <Menu className='h-6 w-6' />
                                )}
                            </motion.div>
                        </motion.button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <motion.div
                    className='md:hidden bg-white border-t border-gray-200'
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className='px-2 pt-2 pb-3 space-y-1'>
                        <Link
                            href='/recipes'
                            className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md'
                            onClick={() => setIsMenuOpen(false)}
                        >
                            All Recipes
                        </Link>
                        {user && (
                            <>
                                <Link
                                    href='/recipes/my-recipes'
                                    className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Recipes
                                </Link>
                                {user ? (
                                    <Link
                                        href='/recipes/add'
                                        className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md'
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Add Recipe
                                    </Link>
                                ) : (
                                    <button
                                        className='block w-full text-left px-3 py-2 text-base font-medium text-gray-400 cursor-not-allowed rounded-md'
                                        disabled
                                    >
                                        Add Recipe (Login required)
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        logout()
                                        setIsMenuOpen(false)
                                    }}
                                    className='block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md'
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        {!user && (
                            <>
                                <button
                                    onClick={() => {
                                        setShowLoginModal(true)
                                        setIsMenuOpen(false)
                                    }}
                                    className='block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md'
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => {
                                        setShowRegisterModal(true)
                                        setIsMenuOpen(false)
                                    }}
                                    className='block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md'
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            )}

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={() => {
                    setShowLoginModal(false)
                    setShowRegisterModal(true)
                }}
            />
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={() => {
                    setShowRegisterModal(false)
                    setShowLoginModal(true)
                }}
            />
        </motion.nav>
    )
}
