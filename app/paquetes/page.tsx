import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Clock, ImageIcon, Download, Users, Heart, Sparkles, Crown, Check, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Import data
import packagesData from "@/data/packages.json"
import siteContent from "@/data/site-content.json"

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
}

const getColorClasses = (color: string, variant: "bg" | "text" | "border" | "hover") => {
  const colorMap = {
    rose: {
      bg: "bg-brand-primary",
      text: "text-brand-primary",
      border: "border-brand-primary",
      hover: "hover:bg-brand-primary/90",
    },
    amber: {
      bg: "bg-brand-primary",
      text: "text-brand-primary",
      border: "border-brand-primary",
      hover: "hover:bg-brand-primary/90",
    },
    emerald: {
      bg: "bg-brand-primary",
      text: "text-brand-primary",
      border: "border-brand-primary",
      hover: "hover:bg-brand-primary/90",
    },
    purple: {
      bg: "bg-brand-primary",
      text: "text-brand-primary",
      border: "border-brand-primary",
      hover: "hover:bg-brand-primary/90",
    },
  }
  return colorMap[color as keyof typeof colorMap]?.[variant] || colorMap.rose[variant]
}

export default function PaquetesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-white to-brand-secondary">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-brand-primary/20 z-50">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-brand-primary" />
            <span className="text-2xl font-serif font-bold text-brand-dark">{siteContent.brand.name}</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {siteContent.navigation.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`transition-colors font-medium ${
                  item.href === "/paquetes" ? "text-brand-primary" : "text-slate-700 hover:text-brand-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300">
            {siteContent.cta.button}
          </Button>
        </div>
      </header>

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
              <span className="text-brand-primary block">{packagesData.hero.highlight}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">{packagesData.hero.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Packages Sections */}
      <div className="py-16">
        {packagesData.packages.map((packageData, packageIndex) => (
          <section key={packageIndex} className={packageIndex % 2 === 0 ? "bg-white" : "bg-slate-50"}>
            <div className="container mx-auto px-4 lg:px-6 py-16">
              {/* Package Header */}
              <div className="text-center mb-16">
                <div className={`w-16 h-16 bg-brand-primary flex items-center justify-center mx-auto mb-6`}>
                  {React.createElement(iconMap[packageData.icon as keyof typeof iconMap], {
                    className: "h-8 w-8 text-white",
                  })}
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">{packageData.name}</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">{packageData.description}</p>
              </div>

              {/* Tiers Grid */}
              <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {packageData.tiers.map((tier, tierIndex) => (
                  <Card
                    key={tierIndex}
                    className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                      tier.popular
                        ? `ring-2 ${getColorClasses(packageData.color, "border")} ring-opacity-50 scale-105`
                        : ""
                    } bg-white`}
                  >
                    {tier.popular && (
                      <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2`}>
                        <Badge
                          className={`${getColorClasses(packageData.color, "bg")} ${getColorClasses(packageData.color, "hover")} text-white px-4 py-1 text-sm font-semibold`}
                        >
                          <Crown className="h-4 w-4 mr-1" />
                          Más Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl font-serif font-bold text-brand-dark mb-2">{tier.name}</CardTitle>
                      <div className={`text-4xl font-bold text-brand-primary mb-4`}>{tier.price}</div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Key Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="text-sm text-slate-500">Duración</p>
                            <p className="font-semibold text-slate-800">{tier.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="text-sm text-slate-500">Fotos</p>
                            <p className="font-semibold text-slate-800">{tier.photos}</p>
                          </div>
                        </div>
                      </div>

                      {/* Features List */}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3">Incluye:</h4>
                        <ul className="space-y-2">
                          {tier.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2">
                              <Check className={`h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0`} />
                              <span className="text-slate-600 text-sm leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Delivery Time */}
                      <div className="flex items-center space-x-2 pt-4 border-t border-slate-100">
                        <Download className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-500">Tiempo de entrega</p>
                          <p className="font-semibold text-slate-800">{tier.delivery}</p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        className={`w-full ${getColorClasses(packageData.color, "bg")} ${getColorClasses(packageData.color, "hover")} text-white py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
                          tier.popular ? "ring-2 ring-offset-2 ring-opacity-50" : ""
                        }`}
                      >
                        Seleccionar {tier.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-primary/80">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">{packagesData.cta.title}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{packagesData.cta.subtitle}</p>
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

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="h-8 w-8 text-brand-primary" />
                <span className="text-2xl font-serif font-bold">{siteContent.brand.name}</span>
              </div>
              <p className="text-slate-300 leading-relaxed max-w-md">{siteContent.brand.tagline}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{siteContent.footer.quickLinks}</h4>
              <ul className="space-y-2">
                {siteContent.navigation.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href} className="text-slate-300 hover:text-brand-primary transition-colors">
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
              © {new Date().getFullYear()} {siteContent.brand.name}. {siteContent.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
