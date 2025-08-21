'use client'

import { CreateRecipeData } from '@/lib/api'
import { Plus, X } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

export interface RecipeFormValues extends Partial<CreateRecipeData> {}

interface RecipeFormProps {
    initialValues?: RecipeFormValues
    submitLabel: string
    onSubmit: (values: RecipeFormValues) => Promise<void> | void
    isSubmitting?: boolean
}

export default function RecipeForm({
    initialValues,
    submitLabel,
    onSubmit,
    isSubmitting,
}: RecipeFormProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RecipeFormValues>({
        defaultValues: {
            title: '',
            description: '',
            ingredients: [''],
            instructions: [''],
            prepTime: undefined,
            cookTime: undefined,
            servings: undefined,
            difficulty: '',
            imageUrl: '',
            ...(initialValues || {}),
        },
    })

    useEffect(() => {
        if (initialValues) {
            reset({
                ...initialValues,
                ingredients:
                    initialValues.ingredients && initialValues.ingredients.length
                        ? initialValues.ingredients
                        : [''],
                instructions:
                    initialValues.instructions && initialValues.instructions.length
                        ? initialValues.instructions
                        : [''],
            })
        }
    }, [initialValues, reset])

    const {
        fields: ingredientFields,
        append: appendIngredient,
        remove: removeIngredient,
    } = useFieldArray({ control, name: 'ingredients' as const })

    const {
        fields: instructionFields,
        append: appendInstruction,
        remove: removeInstruction,
    } = useFieldArray({ control, name: 'instructions' as const })

    const onSubmitInternal = async (data: RecipeFormValues) => {
        const cleaned = {
            ...data,
            ingredients: (data.ingredients || []).filter(x => (x || '').trim() !== ''),
            instructions: (data.instructions || []).filter(x => (x || '').trim() !== ''),
        }
        await onSubmit(cleaned)
    }

    return (
        <form onSubmit={handleSubmit(onSubmitInternal)} className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Title *</label>
                    <input
                        {...register('title', { required: 'Recipe title is required' })}
                        type='text'
                        className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
                        placeholder='Enter recipe title'
                    />
                    {errors.title && (
                        <p className='mt-1 text-sm text-red-600'>
                            {errors.title.message as string}
                        </p>
                    )}
                </div>

                <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Description
                    </label>
                    <textarea
                        {...register('description')}
                        rows={3}
                        className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
                        placeholder='Describe your recipe...'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Prep Time (minutes)
                    </label>
                    <input
                        {...register('prepTime', {
                            valueAsNumber: true,
                            min: { value: 1, message: 'At least 1' },
                        })}
                        type='number'
                        className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
                        placeholder='30'
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Cook Time (minutes)
                    </label>
                    <input
                        {...register('cookTime', {
                            valueAsNumber: true,
                            min: { value: 1, message: 'At least 1' },
                        })}
                        type='number'
                        className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
                        placeholder='45'
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Servings</label>
                    <input
                        {...register('servings', {
                            valueAsNumber: true,
                            min: { value: 1, message: 'At least 1' },
                        })}
                        type='number'
                        className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
                        placeholder='4'
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Difficulty
                    </label>
                    <select
                        {...register('difficulty')}
                        className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
                    >
                        <option value=''>Select difficulty</option>
                        <option value='Easy'>Easy</option>
                        <option value='Medium'>Medium</option>
                        <option value='Hard'>Hard</option>
                    </select>
                </div>
                <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Image URL
                    </label>
                    <input
                        {...register('imageUrl')}
                        type='url'
                        className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
                        placeholder='https://example.com/recipe-image.jpg'
                    />
                </div>
            </div>

            <div>
                <div className='flex items-center justify-between mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>Ingredients *</label>
                    <button
                        type='button'
                        onClick={() => appendIngredient('')}
                        className='flex items-center text-black hover:text-gray-800 text-sm font-medium'
                    >
                        <Plus className='h-4 w-4 mr-1' /> Add Ingredient
                    </button>
                </div>
                <div className='space-y-3'>
                    {ingredientFields.map((field, index) => (
                        <div key={field.id} className='flex items-center space-x-3'>
                            <input
                                {...register(`ingredients.${index}` as const, {
                                    required:
                                        index === 0 ? 'At least one ingredient is required' : false,
                                })}
                                type='text'
                                className='flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
                                placeholder={`Ingredient ${index + 1}`}
                            />
                            {ingredientFields.length > 1 && (
                                <button
                                    type='button'
                                    onClick={() => removeIngredient(index)}
                                    className='text-red-600 hover:text-red-700 p-2'
                                >
                                    <X className='h-5 w-5' />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {errors.ingredients?.[0] && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.ingredients[0].message as string}
                    </p>
                )}
            </div>

            <div>
                <div className='flex items-center justify-between mb-4'>
                    <label className='block text-sm font-medium text-gray-700'>
                        Instructions *
                    </label>
                    <button
                        type='button'
                        onClick={() => appendInstruction('')}
                        className='flex items-center text-black hover:text-gray-800 text-sm font-medium'
                    >
                        <Plus className='h-4 w-4 mr-1' /> Add Step
                    </button>
                </div>
                <div className='space-y-3'>
                    {instructionFields.map((field, index) => (
                        <div key={field.id} className='flex items-start space-x-3'>
                            <span className='flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium mt-2'>
                                {index + 1}
                            </span>
                            <textarea
                                {...register(`instructions.${index}` as const, {
                                    required:
                                        index === 0
                                            ? 'At least one instruction is required'
                                            : false,
                                })}
                                rows={2}
                                className='flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black'
                                placeholder={`Step ${index + 1} instructions`}
                            />
                            {instructionFields.length > 1 && (
                                <button
                                    type='button'
                                    onClick={() => removeInstruction(index)}
                                    className='text-red-600 hover:text-red-700 p-2 mt-2'
                                >
                                    <X className='h-5 w-5' />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {errors.instructions?.[0] && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.instructions[0].message as string}
                    </p>
                )}
            </div>

            <div className='flex justify-end gap-3'>
                <button
                    type='submit'
                    disabled={isSubmitting}
                    className='px-5 py-3 rounded-md bg-black text-white disabled:opacity-50'
                >
                    {isSubmitting ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    )
}
