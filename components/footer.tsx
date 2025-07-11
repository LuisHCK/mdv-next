import { Camera } from 'lucide-react'
import React from 'react'
import type { SiteContentData } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

interface FooterProps {
    siteContent: SiteContentData
}

const Footer = ({ siteContent }: FooterProps) => {
    return (
        <footer className="bg-brand-dark text-white py-12">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                            <Image
                                src="/logo-primary-large.avif"
                                alt="Memorias de Vida Logo"
                                width={300}
                                height={200}
                            />
                        </div>
                        <p className="text-slate-300 leading-relaxed max-w-md">
                            {siteContent.brand.tagline}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">{siteContent.footer.quickLinks}</h4>
                        <ul className="space-y-2">
                            {siteContent.navigation.links.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-300 hover:text-brand-primary transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">{siteContent.footer.services}</h4>
                        <ul className="space-y-2">
                            {siteContent.footer.servicesList.map((service, index) => (
                                <li key={index} className="text-slate-300">
                                    {service}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-700 mt-8 pt-8 text-center">
                    <p className="text-slate-400">
                        © {new Date().getFullYear()} {siteContent.brand.name}.{' '}
                        {siteContent.footer.copyright}
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
