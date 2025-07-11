import React from 'react'
import { Camera } from 'lucide-react'
import { SiteContentData } from '@/types'
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'

interface HeaderProps {
    siteContent: SiteContentData
}

const Header = ({ siteContent }: HeaderProps) => {
    return (
        <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-brand-primary/20 z-50">
            <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Image src={siteContent.navigation.logo} alt={siteContent.navigation.logoAlt} width={64} height={64} />
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
                <Button
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    asChild
                >
                    <Link href={siteContent.cta.link}>{siteContent.cta.button}</Link>
                </Button>
            </div>
        </header>
    )
}

export default Header
