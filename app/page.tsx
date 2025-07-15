import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
    Heart,
    Star,
    Users,
    Calendar,
    Award,
    Phone,
    Mail,
    MapPin,
    Instagram,
    Facebook,
    Twitter
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Import data
import siteContent from '@/data/site-content.json'
import testimonials from '@/data/testimonials.json'
import contactData from '@/data/contact.json'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { cn } from '@/lib/utils'

// Icon mapping
const iconMap = {
    Heart,
    Users,
    Calendar,
    Award,
    Phone,
    Mail,
    MapPin,
    Instagram,
    Facebook,
    Twitter
}

export default function MemoriasDeVidaLanding() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-white to-brand-secondary">
            <Header siteContent={siteContent} />

            {/* Hero Section */}
            <section
                id="inicio"
                className="relative h-screen flex items-center justify-center overflow-hidden"
            >
                <div className="absolute inset-0 z-0">
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/hero-video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/80 via-transparent to-brand-secondary/80" /> */}
                </div>
                <div className="flex flex-col justify-center items-center gap-6 relative z-10 text-center max-w-4xl mx-auto px-4">
                    <Image
                        src="/logo-primary-large.avif"
                        alt="Memorias de Vida Logo"
                        width={600}
                        height={400}
                    />
                    <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto leading-relaxed">
                        {siteContent.hero.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                            asChild
                        >
                            <Link href="/#servicios">{siteContent.hero.primaryButton}</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="servicios" className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">
                            {siteContent.services.title}
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            {siteContent.services.subtitle}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {siteContent.services.items.map((service, index) => {
                            const IconComponent = iconMap[service.icon as keyof typeof iconMap]
                            return (
                                <Card
                                    key={index}
                                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-brand-secondary to-white"
                                >
                                    <CardContent className="p-8 text-center">
                                        <div className="w-16 h-16 bg-brand-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-primary/30 transition-colors">
                                            <IconComponent className="h-8 w-8 text-brand-primary" />
                                        </div>
                                        <h3 className="text-xl font-serif font-bold text-brand-dark mb-4">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section
                id="portafolio"
                className="py-20 bg-gradient-to-br from-slate-50 to-brand-secondary"
            >
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">
                            {siteContent.portfolio.title}
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            {siteContent.portfolio.subtitle}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {siteContent.portfolio.images.map((image, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                <Image
                                    src={image.src || '/placeholder.svg'}
                                    alt={image.alt}
                                    width={320}
                                    height={480}
                                    className={cn(
                                        'object-cover w-full h-100 group-hover:scale-110 transition-transform duration-500',
                                        image.classnames
                                    )}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h3 className="text-xl font-serif font-bold mb-2">
                                            {image.title}
                                        </h3>
                                        <p className="text-sm opacity-90">{image.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonios" className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">
                            {siteContent.testimonials.title}
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            {siteContent.testimonials.subtitle}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.testimonials.map((testimonial, index) => (
                            <Card
                                key={index}
                                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-brand-secondary to-white"
                            >
                                <CardContent className="p-8">
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-5 w-5 text-brand-primary fill-current"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 mb-6 leading-relaxed italic">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-brand-primary/20 flex items-center justify-center mr-4">
                                            <span className="text-brand-primary font-bold text-lg">
                                                {testimonial.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-sm text-slate-500">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section
                id="contacto"
                className="py-20 bg-gradient-to-br from-brand-secondary to-white"
            >
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">
                            {siteContent.contact.title}
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            {siteContent.contact.subtitle}
                        </p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        <Card className="border-0 shadow-xl bg-white">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">
                                    {siteContent.contact.form.title}
                                </h3>
                                <form className="space-y-6">
                                    <div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                {siteContent.contact.form.fields.name}
                                            </label>
                                            <Input
                                                className="border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary"
                                                placeholder={
                                                    siteContent.contact.form.placeholders.name
                                                }
                                                name="name"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            {siteContent.contact.form.fields.phone}
                                        </label>
                                        <Input
                                            className="border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary"
                                            placeholder={
                                                siteContent.contact.form.placeholders.phone
                                            }
                                            type="tel"
                                            name="phone"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            {siteContent.contact.form.fields.message}
                                        </label>
                                        <Textarea
                                            className="border-brand-primary/30 focus:border-brand-primary focus:ring-brand-primary min-h-32"
                                            placeholder={
                                                siteContent.contact.form.placeholders.message
                                            }
                                            name="message"
                                            required
                                        />
                                    </div>
                                    <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                        {siteContent.contact.form.submitButton}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                        <div className="space-y-8">
                            {contactData.contactInfo.map((contact, index) => {
                                const IconComponent = iconMap[contact.icon as keyof typeof iconMap]
                                return (
                                    <Card key={index} className="border-0 shadow-lg bg-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-brand-primary/20 flex items-center justify-center">
                                                    <IconComponent className="h-6 w-6 text-brand-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-800">
                                                        {contact.label}
                                                    </h4>
                                                    <p className="text-slate-600">
                                                        {contact.value}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                            <div className="flex space-x-4">
                                {contactData.socialMedia.map((social, index) => {
                                    const IconComponent =
                                        iconMap[social.icon as keyof typeof iconMap]
                                    return (
                                        <Link
                                            key={index}
                                            href={social.href}
                                            className="w-12 h-12 bg-brand-primary hover:bg-brand-primary/90 flex items-center justify-center text-white transition-colors"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={social.platform}
                                        >
                                            <IconComponent className="h-6 w-6" />
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer siteContent={siteContent} />
        </div>
    )
}
