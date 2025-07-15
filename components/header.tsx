import React from 'react'
import { SiteContentData } from '@/types'
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

interface HeaderProps {
    siteContent: SiteContentData
}

const Header = ({ siteContent }: HeaderProps) => {
    return (
        <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-brand-primary/20 z-50">
            <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
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
                <nav className="hidden md:flex items-center space-x-8">
                    {siteContent.navigation.links.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="text-slate-700 hover:text-brand-primary transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="hidden md:block">
                    <Button
                        className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                        asChild
                    >
                        <Link href={siteContent.cta.link}>
                            {siteContent.cta.button}
                        </Link>
                    </Button>
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
                                {siteContent.navigation.links.map(
                                    (item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className="text-slate-700 hover:text-brand-primary transition-colors font-medium"
                                        >
                                            {item.label}
                                        </Link>
                                    )
                                )}
                                <Button
                                    className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                                    asChild
                                >
                                    <Link href={siteContent.cta.link}>
                                        {siteContent.cta.button}
                                    </Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

export default Header
