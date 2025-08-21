'use client'

import { useAuth } from '@/contexts/AuthContext'
import { CreateRecipeData, recipesAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import RecipeForm, { RecipeFormValues } from './RecipeForm'


export default function AddRecipeForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()
    const router = useRouter()

    const onSubmit = async (data: RecipeFormValues) => {
        if (!user) {
            toast.error('Please login to add a recipe')
            return
        }

        setIsLoading(true)
        try {
            await recipesAPI.create(data as CreateRecipeData)
            toast.success('Recipe added successfully!')
            router.push('/recipes/my-recipes')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add recipe')
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                        Please login to add a recipe
                    </h2>
                    <button
                        onClick={() => {
                            window.dispatchEvent(new Event('open-login-modal'))
                        }}
                        className='bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-md font-medium transition-colors'
                    >
                        Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50 py-12'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='bg-white rounded-xl shadow-lg p-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-8'>Add New Recipe</h1>

                    <RecipeForm
                        submitLabel={isLoading ? 'Adding Recipe...' : 'Add Recipe'}
                        onSubmit={onSubmit}
                        isSubmitting={isLoading}
                    />
                    <div className='mt-6 flex justify-end'>
                        <button
                            type='button'
                            onClick={() => router.back()}
                            className='px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors'
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
