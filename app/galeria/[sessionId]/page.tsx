import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, Calendar, MapPin, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Import data
import siteContent from '@/data/site-content.json'
import Header from '@/components/header'
import { getPhotoSession } from '@/lib/pocketbase'
import PhotoGallery from '@/components/photo-gallery'

export default async function GaleriaPage({ params }: { params: Promise<{ sessionId: string }> }) {
    // Find the session data
    const { sessionId } = await params
    const session = await getPhotoSession(sessionId)

    if (!session) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-secondary via-white to-brand-secondary">
                <div className="text-center">
                    <h1 className="mb-4 text-2xl font-bold text-brand-dark">
                        Sesión no encontrada
                    </h1>
                    <Link href="/">
                        <Button className="bg-brand-primary text-white hover:bg-brand-primary/90">
                            Volver al inicio
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-white to-brand-secondary">
            <Header siteContent={siteContent} />

            {/* Session Info */}
            <section className="border-b border-slate-100 bg-white py-8">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="mb-4 flex items-center">
                        <Link
                            href="/"
                            className="mr-4 inline-flex items-center text-slate-600 transition-colors hover:text-brand-primary"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-0 bg-gradient-to-br from-brand-secondary to-white shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <User className="h-8 w-8 text-brand-primary" />
                                    <div>
                                        <h3 className="font-semibold text-brand-dark">
                                            {session?.client}
                                        </h3>
                                        <p className="text-sm text-slate-600">
                                            {session?.package_id}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-gradient-to-br from-brand-secondary to-white shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-8 w-8 text-brand-primary" />
                                    <div>
                                        <h3 className="font-semibold text-brand-dark">Fecha</h3>
                                        <p className="text-sm text-slate-600">
                                            {new Date(session.created).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-gradient-to-br from-brand-secondary to-white shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-8 w-8 text-brand-primary" />
                                    <div>
                                        <h3 className="font-semibold text-brand-dark">Ubicación</h3>
                                        <p className="text-sm text-slate-600">{session.id}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-gradient-to-br from-brand-secondary to-white shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <Camera className="h-8 w-8 text-brand-primary" />
                                    <div>
                                        <h3 className="font-semibold text-brand-dark">
                                            Total Fotos
                                        </h3>
                                        <p className="text-sm text-slate-600">
                                            {session?.photos.length} imágenes
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            <PhotoGallery photoSession={session} />
        </div>
    )
}
