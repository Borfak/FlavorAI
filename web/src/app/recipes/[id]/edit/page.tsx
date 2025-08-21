'use client'

import RecipeForm, { RecipeFormValues } from '@/components/recipes/RecipeForm'
import { CreateRecipeData, Recipe, recipesAPI } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'


export default function EditRecipePage() {
    const params = useParams()
    const router = useRouter()
    const recipeId = params?.id as string
    const [loading, setLoading] = useState(true)
    const [recipe, setRecipe] = useState<Recipe | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await recipesAPI.getOne(recipeId)
                setRecipe(res.data)
            } catch (e: any) {
                toast.error(e.response?.data?.message || 'Failed to load recipe')
                router.push(`/recipes/${recipeId}`)
            } finally {
                setLoading(false)
            }
        }
        if (recipeId) fetchRecipe()
    }, [recipeId, router])

    const onSubmit = async (data: RecipeFormValues) => {
        try {
            setIsSubmitting(true)
            await recipesAPI.update(recipeId, data as CreateRecipeData)
            toast.success('Recipe updated')
            router.push(`/recipes/${recipeId}`)
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Update failed')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
    }

    if (!recipe) return null

    return (
        <div className='min-h-screen bg-gray-50 py-12'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='bg-white rounded-xl shadow-lg p-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-8'>Edit Recipe</h1>
                    <RecipeForm
                        initialValues={recipe as any}
                        submitLabel={isSubmitting ? 'Saving...' : 'Save Changes'}
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                    />
                    <div className='mt-6 flex justify-end'>
                        <button
                            type='button'
                            onClick={() => router.push(`/recipes/${recipeId}`)}
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
