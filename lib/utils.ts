import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class values into a single string, handling conditional and deduplicated class names.
 *
 * Utilizes `clsx` to conditionally join class names and `twMerge` to intelligently merge Tailwind CSS classes,
 * ensuring that conflicting classes are resolved according to Tailwind's rules.
 *
 * @param inputs - An array of class values (strings, arrays, objects, etc.) to be merged.
 * @returns A single string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' | 'hover') => {
    const colorMap = {
        rose: {
            bg: 'bg-brand-primary',
            text: 'text-brand-primary',
            border: 'border-brand-primary',
            hover: 'hover:bg-brand-primary/90'
        },
        amber: {
            bg: 'bg-brand-primary',
            text: 'text-brand-primary',
            border: 'border-brand-primary',
            hover: 'hover:bg-brand-primary/90'
        },
        emerald: {
            bg: 'bg-brand-primary',
            text: 'text-brand-primary',
            border: 'border-brand-primary',
            hover: 'hover:bg-brand-primary/90'
        },
        purple: {
            bg: 'bg-brand-primary',
            text: 'text-brand-primary',
            border: 'border-brand-primary',
            hover: 'hover:bg-brand-primary/90'
        }
    }
    return colorMap[color as keyof typeof colorMap]?.[variant] || colorMap.rose[variant]
}
