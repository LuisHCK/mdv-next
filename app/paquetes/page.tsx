import React from 'react'
import { Button } from '@/components/ui/button'
import type { PackageTier } from '@/types'

import {
    Camera,
    Clock,
    ImageIcon,
    Download,
    Users,
    Heart,
    Sparkles,
    Crown,
    Check,
    ArrowLeft,
    Baby,
    Mountain
} from 'lucide-react'
import Link from 'next/link'

// Import data
import packagesData from '@/data/packages.json'
import siteContent from '@/data/site-content.json'
import TierCard from '@/components/tier-card'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { getPackages, getTiers } from '@/lib/pocketbase'

// ISR Config
export const revalidate = 3600

// Icon mapping
const iconMap = {
    Heart,
    Users,
    Camera,
    Sparkles,
    Clock,
    ImageIcon,
    Download,
    Check,
    Crown,
    Baby,
    Mountain
}

export default async function PaquetesPage() {
    const packages = await getPackages()
    const tiers = await getTiers()

    const packageTiers = (packageId: string): PackageTier[] => {
        return tiers.filter((tier) => tier.package_id === packageId)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-white to-brand-secondary">
            <Header siteContent={siteContent} />

            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-r from-brand-secondary via-white to-brand-secondary">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="text-center max-w-4xl mx-auto">
                        <Link
                            href="/"
                            className="inline-flex items-center text-slate-600 hover:text-brand-primary transition-colors mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {packagesData.hero.backButton}
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark mb-6">
                            {packagesData.hero.title}
                            <span className="text-brand-primary block">
                                {packagesData.hero.highlight}
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
                            {packagesData.hero.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Packages Sections */}
            <div className="py-16">
                {packages.map((packageData, packageIndex) => (
                    <section
                        key={packageIndex}
                        className={packageIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                    >
                        <div className="container mx-auto px-4 lg:px-6 py-16">
                            {/* Package Header */}
                            <div className="text-center mb-16">
                                <div
                                    className={`w-16 h-16 bg-brand-primary flex items-center justify-center mx-auto mb-6`}
                                >
                                    {React.createElement(
                                        iconMap[packageData.icon as keyof typeof iconMap],
                                        {
                                            className: 'h-8 w-8 text-white'
                                        }
                                    )}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
                                    {packageData.name}
                                </h2>
                                {packageData.description && (
                                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                                        {packageData.description}
                                    </p>
                                )}
                            </div>

                            {/* Tiers Grid */}
                            <div className="flex gap-8 flex-wrap justify-center align-items-center">
                                {packageTiers(packageData.id).map((tier, tierIndex) => (
                                    <TierCard
                                        key={tierIndex}
                                        tier={tier}
                                        tierIndex={tierIndex}
                                        packageData={packageData}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-primary/80">
                <div className="container mx-auto px-4 lg:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                        {packagesData.cta.title}
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        {packagesData.cta.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-brand-primary hover:bg-brand-secondary px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                            {packagesData.cta.primaryButton}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white text-white hover:bg-white hover:text-rose-500 px-8 py-4 text-lg transition-all duration-300 bg-transparent"
                        >
                            {packagesData.cta.secondaryButton}
                        </Button>
                    </div>
                </div>
            </section>

            <Footer siteContent={siteContent} />
        </div>
    )
}
