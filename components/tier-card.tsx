import React from 'react'
import type { Package, PackageTier } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, getColorClasses } from '@/lib/utils'
import { Check, Clock, Crown, Download, ImageIcon } from 'lucide-react'
import { Button } from './ui/button'

interface TierCardProps {
    tier: PackageTier
    tierIndex: number
    packageData: Package
}

const TierCard = ({ tier, tierIndex, packageData }: TierCardProps) => {
    const popularClass =
        tier.popular && cn('ring-2 ring-opacity-50', getColorClasses(packageData.color, 'border'))
    return (
        <Card
            key={tierIndex}
            className={cn(
                'relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white max-w-[480px] w-full',
                popularClass
            )}
        >
            {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge
                        className={cn(
                            getColorClasses(packageData.color, 'bg'),
                            getColorClasses(packageData.color, 'hover'),
                            'text-white px-4 py-1 text-sm font-semibold'
                        )}
                    >
                        <Crown className="h-4 w-4 mr-1" />
                        Más Popular
                    </Badge>
                </div>
            )}
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-serif font-bold text-brand-dark mb-2">
                    {tier.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Key Details */}
                <div className="grid grid-cols-3 gap-1">
                    <div className="flex flex-col items-center">
                        <ImageIcon className="h-5 w-5 text-slate-400 mb-2" />
                        <div className="text-center">
                            <p className="text-sm text-slate-500">Fotos</p>
                            <p className="text-sm font-semibold text-slate-800 xl:whitespace-nowrap">
                                {tier.photos}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <Clock className="h-5 w-5 text-slate-400 mb-2" />
                        <div className="text-center">
                            <p className="text-sm text-slate-500">Duración</p>
                            <p className="text-sm font-semibold text-slate-800">{tier.duration}</p>
                        </div>
                    </div>
                    {/* Delivery Time */}
                    <div className="flex flex-col items-center">
                        <Download className="h-5 w-5 text-slate-400 mb-2" />
                        <div className="text-center">
                            <p className="text-sm text-slate-500">Tiempo de entrega</p>
                            <p className="text-sm font-semibold text-slate-800">{tier.delivery}</p>
                        </div>
                    </div>
                </div>

                {/* Features List */}
                <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Incluye:</h4>
                    <ul className="space-y-2">
                        {tier.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2">
                                <Check className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
                                <span className="text-slate-600 text-sm leading-relaxed">
                                    {feature.feature}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="text-center">
                    <h4 className="font-semibold text-slate-800 mb-3">Inversion:</h4>
                    <p className="text-2xl font-bold text-brand-primary">
                        {tier.price}
                    </p>
                </div>

                {/* CTA Button */}
                <Button
                    className={cn(
                        'w-full text-white py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300',
                        getColorClasses(packageData.color, 'bg'),
                        getColorClasses(packageData.color, 'hover'),
                        tier.popular && 'ring-2 ring-offset-2 ring-opacity-50'
                    )}
                    asChild
                >
                    <a href={`/reservas?package=${packageData.id}&tier=${tier.id}`}>
                        Reservar ahora
                    </a>
                </Button>
            </CardContent>
        </Card>
    )
}

export default TierCard
