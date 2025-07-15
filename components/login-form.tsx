'use client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { loginUser } from '@/app/actions'

interface LoginFormProps {
    className?: string
}

export function LoginForm({ className }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            setError(null)

            const formData = new FormData(e.currentTarget as HTMLFormElement)
            const email = formData.get('email') as string
            const password = formData.get('password') as string

            // Call the server action to log in
            const success = await loginUser(email, password)
            console.log('Login success:', success)

            if (success) {
                window.location.replace('/admin/dashboard')
            } else {
                setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.')
            }
        } catch (error) {
            console.error('Login failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className={cn(
                'flex min-h-screen items-center justify-center px-4 md:px-0',
                'bg-cover bg-center',
                className
            )}
            style={{
                backgroundImage: 'url(/assets/bg-login.jpg)'
            }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Inicia sesión en tu cuenta</CardTitle>
                    <CardDescription>
                        Ingresa tu correo electrónico para iniciar sesión en tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="email@ejemplo.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="********"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                                </Button>
                            </div>
                            {error && <div className="text-sm text-red-500">{error}</div>}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
