'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { SessionData } from '@/types'

interface SessionFormProps {
    sessionData: SessionData
    onSessionDataChange: (data: SessionData) => void
}

export function SessionForm({ sessionData, onSessionDataChange }: SessionFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        onSessionDataChange({ ...sessionData, [id]: value })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Información de la Sesión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="clientName">Nombre del Cliente *</Label>
                        <Input
                            id="clientName"
                            value={sessionData.clientName}
                            onChange={handleChange}
                            placeholder="Ej: María González"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="sessionDate">Fecha de la Sesión *</Label>
                        <Input
                            id="sessionDate"
                            type="date"
                            value={sessionData.sessionDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="location">Ubicación</Label>
                        <Input
                            id="location"
                            value={sessionData.location}
                            onChange={handleChange}
                            placeholder="Ej: Estudio, Parque Central"
                        />
                    </div>
                    <div>
                        <Label htmlFor="packageType">Tipo de Paquete</Label>
                        <Input
                            id="packageType"
                            value={sessionData.packageType}
                            onChange={handleChange}
                            placeholder="Ej: Perfil Profesional, Infantil"
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                        id="description"
                        value={sessionData.description}
                        onChange={handleChange}
                        placeholder="Notas adicionales sobre la sesión..."
                        rows={3}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
