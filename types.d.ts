// Centralized TypeScript interfaces for all data JSON files

// --- packages.json ---
export interface PackageTier {
    id: string
    name: string
    price: string
    duration: string
    photos: string
    features: string[]
    delivery: string
    popular: boolean
    package_id: string // Reference to the package this tier belongs to
}

export interface Package {
    id: string
    name: string
    description: string
    icon: string
    color: string
    tiers: PackageTier[]
}

export interface PackagesHero {
    title: string
    highlight: string
    subtitle: string
    backButton: string
}

export interface PackagesCTA {
    title: string
    subtitle: string
    primaryButton: string
    secondaryButton: string
}

export interface PackagesData {
    hero: PackagesHero
    packages: Package[]
    cta: PackagesCTA
}

// --- contact.json ---
export interface ContactInfo {
    type: string
    icon: string
    label: string
    value: string
}

export interface SocialMedia {
    platform: string
    icon: string
    href: string
}

export interface ContactData {
    contactInfo: ContactInfo[]
    socialMedia: SocialMedia[]
}

// --- testimonials.json ---
export interface Testimonial {
    name: string
    text: string
    rating: number
    role: string
}

export interface TestimonialsData {
    testimonials: Testimonial[]
}

// --- photo-sessions.json ---
export interface Photo {
    id: string
    filename: string
    src: string
    thumbnail: string
    alt: string
    caption: string
    tags: string[]
}

export interface PhotoSession {
    id: string
    clientName: string
    sessionType: string
    date: string
    photographer: string
    location: string
    totalPhotos: number
    deliveryDate: string
    photos: Photo[]
}

export interface PhotoSessionsData {
    sessions: PhotoSession[]
}

// --- site-content.json ---
export interface Brand {
    name: string
    tagline: string
}

export interface NavigationItem {
    label: string
    href: string
}

export interface HeroBackgroundImage {
    src: string
    alt: string
}

export interface SiteHero {
    title: string
    highlight: string
    subtitle: string
    primaryButton: string
    secondaryButton: string
    backgroundImage: HeroBackgroundImage
}

export interface ServiceItem {
    title: string
    description: string
    icon: string
}

export interface Services {
    title: string
    subtitle: string
    items: ServiceItem[]
}

export interface PortfolioImage {
    src: string
    alt: string
    title: string
    description: string
    classnames?: string // Optional classnames for additional styling
}

export interface Portfolio {
    title: string
    subtitle: string
    images: PortfolioImage[]
}

export interface TestimonialsSection {
    title: string
    subtitle: string
}

export interface ContactFormFields {
    name: string
    email: string
    phone: string
    message: string
}

export interface ContactFormPlaceholders {
    name: string
    email: string
    phone: string
    message: string
}

export interface ContactForm {
    title: string
    fields: ContactFormFields
    placeholders: ContactFormPlaceholders
    submitButton: string
}

export interface ContactSection {
    title: string
    subtitle: string
    form: ContactForm
}

export interface Footer {
    quickLinks: string
    services: string
    servicesList: string[]
    copyright: string
}

export interface CTA {
    button: string
    link: string
}

export interface Navigation {
    links: NavigationItem[]
    logo: string
    logoAlt: string
}

export interface SiteContentData {
    brand: Brand
    navigation: Navigation
    hero: SiteHero
    services: Services
    portfolio: Portfolio
    testimonials: TestimonialsSection
    contact: ContactSection
    footer: Footer
    cta: CTA
}

interface Reservation {
    id: string
    datetime: string
    package_id: string
    tier_id: string
    name: string
    phone: string
    message: string
    created?: string // Optional field for created date
    updated?: string // Optional field for updated date
}


interface ReservationFormData {
    id?: string // Optional ID for existing reservations
    date: string
    time: string
    package: string
    tier: string
    name: string
    phone: string
    message: string,
    created?: string // Optional field for created date
}
