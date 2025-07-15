import React from 'react'
import { SiteContentData } from '@/types'
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

interface HeaderProps {
    siteContent: SiteContentData
    isAdmin?: boolean
}

const Header = ({ siteContent, isAdmin }: HeaderProps) => {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-brand-primary/20 bg-white/90 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
                <div className="flex items-center space-x-2">
                    <Link href="/" aria-description="Inicio">
                        <Image
                            src={siteContent.navigation.logo}
                            alt={siteContent.navigation.logoAlt}
                            width={64}
                            height={64}
                        />
                    </Link>
                </div>
                <nav className="hidden items-center space-x-8 md:flex">
                    {siteContent.navigation.links.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="font-medium text-slate-700 transition-colors hover:text-brand-primary"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="hidden md:block">
                    {!isAdmin && (
                        <Button
                            className="bg-brand-primary px-6 py-2 text-white shadow-lg transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-xl"
                            asChild
                        >
                            <Link href={siteContent.cta.link}>{siteContent.cta.button}</Link>
                        </Button>
                    )}
                </div>
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Abrir menú</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>Menú</SheetTitle>
                            </SheetHeader>
                            <div className="grid gap-4 py-6">
                                {siteContent.navigation.links.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="font-medium text-slate-700 transition-colors hover:text-brand-primary"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                {!isAdmin && (
                                    <Button
                                        className="bg-brand-primary px-6 py-2 text-white shadow-lg transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-xl"
                                        asChild
                                    >
                                        <Link href={siteContent.cta.link}>
                                            {siteContent.cta.button}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

export default Header
