'use client'

import RatingSystem from '@/components/recipes/RatingSystem'
import { useAuth } from '@/contexts/AuthContext'
import { Recipe, recipesAPI } from '@/lib/api'
import { Clock, Pencil, Star, Trash2, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function RecipeDetailPage() {
    const [recipe, setRecipe] = useState<Recipe | null>(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()

    const recipeId = params?.id as string

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await recipesAPI.getOne(recipeId)
                setRecipe(response.data)
            } catch (error) {
                console.error('Failed to fetch recipe:', error)
                toast.error('Recipe not found')
                router.push('/')
            } finally {
                setLoading(false)
            }
        }

        if (recipeId) {
            fetchRecipe()
        }
    }, [recipeId, router])

    const handleDeleteRecipe = async () => {
        if (!user || !recipe) return

        const confirmed = window.confirm(
            'Are you sure you want to delete this recipe? This action cannot be undone.'
        )
        if (!confirmed) return

        try {
            await recipesAPI.delete(recipeId)
            toast.success('Recipe deleted successfully')
            router.push('/recipes/my-recipes')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete recipe')
        }
    }

    const renderStars = (rating: number) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} className='h-5 w-5 text-yellow-400' fill='currentColor' />)
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={i} className='relative'>
                        <Star className='h-5 w-5 text-gray-300' />
                        <div className='absolute inset-0 overflow-hidden w-1/2'>
                            <Star className='h-5 w-5 text-yellow-400' fill='currentColor' />
                        </div>
                    </div>
                )
            } else {
                stars.push(<Star key={i} className='h-5 w-5 text-gray-300' />)
            }
        }
        return stars
    }

    const refreshRecipe = async () => {
        try {
            const response = await recipesAPI.getOne(recipeId)
            setRecipe(response.data)
        } catch (error) {
            console.error('Failed to refresh recipe:', error)
        }
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-white grid-bg flex items-center justify-center'>
                <motion.div
                    className='text-center'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className='animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto'
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className='mt-4 text-gray-600 font-medium'>Loading recipe...</p>
                </motion.div>
            </div>
        )
    }

    if (!recipe) {
        return (
            <div className='min-h-screen bg-white grid-bg flex items-center justify-center'>
                <motion.div
                    className='text-center'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className='text-3xl font-bold text-black mb-4'>Recipe not found</h2>
                    <motion.button
                        onClick={() => router.push('/')}
                        className='btn-primary'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Back to Recipes
                    </motion.button>
                </motion.div>
            </div>
        )
    }

    const isOwner = user?.id === recipe.author.id

    return (
        <div className='min-h-screen bg-white'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                {recipe.imageUrl && (
                    <motion.img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className='w-full h-64 md:h-80 object-cover'
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6 }}
                    />
                )}

                <div className='p-8'>
                    <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4'>
                        <motion.h1
                            className='text-3xl md:text-4xl font-bold text-gray-900'
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {recipe.title}
                        </motion.h1>

                        {isOwner && (
                            <motion.div
                                className='flex items-center space-x-2'
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <motion.button
                                    onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
                                    className='p-2 text-gray-600 hover:text-black transition-colors'
                                    title='Edit Recipe'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Pencil className='h-5 w-5' />
                                </motion.button>
                                <motion.button
                                    onClick={handleDeleteRecipe}
                                    className='p-2 text-gray-600 hover:text-red-600 transition-colors'
                                    title='Delete Recipe'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Trash2 className='h-5 w-5' />
                                </motion.button>
                            </motion.div>
                        )}
                    </div>

                    {recipe.description && (
                        <motion.p
                            className='text-gray-600 text-lg mb-6'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {recipe.description}
                        </motion.p>
                    )}

                    <motion.div
                        className='flex items-center justify-between mb-6'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className='flex items-center space-x-1'>
                            {renderStars(recipe.averageRating)}
                            <span className='text-gray-600 ml-2'>
                                ({recipe._count.ratings} rating
                                {recipe._count.ratings !== 1 ? 's' : ''})
                            </span>
                        </div>

                        <div className='flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600'>
                            {recipe.prepTime && (
                                <div className='flex items-center'>
                                    <Clock className='h-5 w-5 mr-1' />
                                    Prep: {recipe.prepTime}m
                                </div>
                            )}
                            {recipe.cookTime && (
                                <div className='flex items-center'>
                                    <Clock className='h-5 w-5 mr-1' />
                                    Cook: {recipe.cookTime}m
                                </div>
                            )}
                            {recipe.servings && (
                                <div className='flex items-center'>
                                    <Users className='h-5 w-5 mr-1' />
                                    Serves {recipe.servings}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className='text-gray-600'>
                            By <span className='font-medium text-black'>{recipe.author.name}</span>
                        </span>
                        {recipe.difficulty && (
                            <span className='px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full'>
                                {recipe.difficulty}
                            </span>
                        )}
                    </motion.div>
                </div>
            </div>

            <motion.div
                className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    <div>
                        <h2 className='text-2xl font-bold text-black mb-3'>Ingredients</h2>
                        <ul className='list-disc list-inside space-y-2 text-gray-700'>
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>

                    <div className='lg:col-span-2'>
                        <h2 className='text-2xl font-bold text-black mb-3'>Instructions</h2>
                        <ol className='list-decimal list-inside space-y-3 text-gray-700 leading-relaxed'>
                            {recipe.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className='bg-white border border-gray-200 rounded-lg p-6 mt-8 mx-4 sm:mx-6 lg:mx-8 mb-12'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                <RatingSystem
                    recipeId={recipe.id}
                    currentRating={
                        user ? recipe.ratings.find(r => r.user?.id === user.id)?.rating : undefined
                    }
                    averageRating={recipe.averageRating}
                    totalRatings={recipe._count.ratings}
                    onRatingUpdate={refreshRecipe}
                />
            </motion.div>
        </div>
    )
}
