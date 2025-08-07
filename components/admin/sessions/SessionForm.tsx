'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { Package, PublishedPhotoSession } from '@/types'

interface SessionFormProps {
    sessionData: Partial<PublishedPhotoSession>
    onSessionDataChange: (data: Partial<PublishedPhotoSession>) => void
    packages: Package[]
}

export function SessionForm({ sessionData, onSessionDataChange, packages }: SessionFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.currentTarget

        switch (id) {
            case 'client':
                onSessionDataChange({ ...sessionData, client: String(value) })
                break
            case 'visible':
                onSessionDataChange({ ...sessionData, visible: value === 'true' })
                break
            case 'package':
                onSessionDataChange({ ...sessionData, package_id: String(value) })
                break
            case 'phone':
                onSessionDataChange({ ...sessionData, phone: String(value) })
            default:
                break
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Información de la Sesión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="client">Nombre del Cliente *</Label>
                        <Input
                            id="client"
                            name="client"
                            value={sessionData.client}
                            onChange={handleChange}
                            placeholder="Ej: Mary Zavala"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={sessionData.phone}
                            onChange={handleChange}
                            placeholder="Ej: +505 1234 5678"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="location">Paquete</Label>
                        <Select
                            onValueChange={(value) =>
                                onSessionDataChange({ ...sessionData, package_id: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un paquete" />
                            </SelectTrigger>
                            <SelectContent>
                                {packages.map((pkg) => (
                                    <SelectItem key={`pkg-opt-${pkg.id}`} value={pkg.id}>
                                        {pkg.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-3">
                        <Label htmlFor="visible">Visible</Label>
                        <Switch
                            id="visible"
                            onCheckedChange={(checked) =>
                                onSessionDataChange({
                                    ...sessionData,
                                    visible: checked
                                })
                            }
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
