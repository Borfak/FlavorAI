'use client'

import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const portalTarget = typeof document !== 'undefined' ? document.body : null
    if (!portalTarget) return null

    return createPortal(
        <div className='fixed inset-0 z-[100]'>
            <motion.div
                className='absolute inset-0 bg-black/30 backdrop-blur-lg cursor-pointer'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            <div className='flex items-center justify-center min-h-screen p-4'>
                <motion.div
                    className='relative bg-white rounded-lg shadow-2xl border border-gray-200 max-w-md w-full mx-4 max-h-[85vh] overflow-y-auto'
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    onClick={e => e.stopPropagation()}
                >
                    {title && (
                        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                            <h2 className='text-xl font-bold text-black'>{title}</h2>
                            <motion.button
                                onClick={onClose}
                                className='p-1 text-gray-400 hover:text-black transition-colors'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className='h-6 w-6' />
                            </motion.button>
                        </div>
                    )}

                    <div className={title ? 'p-6' : 'p-6'}>{children}</div>
                </motion.div>
            </div>
        </div>,
        portalTarget
    )
}
