import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Calendar, MapPin, User, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Import data
import photoSessionsData from "@/data/photo-sessions.json"
import siteContent from "@/data/site-content.json"
import Header from "@/components/header"

export default function GaleriaIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-white to-brand-secondary">
      {/* Header */}
      <Header siteContent={siteContent} />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-brand-secondary via-white to-brand-secondary">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark mb-6">
            Galerías de
            <span className="text-brand-primary block">Sesiones</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Accede a tus sesiones fotográficas completadas y revive esos momentos especiales
          </p>
        </div>
      </section>

      {/* Sessions List */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photoSessionsData.sessions.map((session) => (
              <Card
                key={session.id}
                className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={session.photos[0]?.thumbnail || "/placeholder.svg"}
                    alt={`Sesión de ${session.clientName}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-serif font-bold">{session.clientName}</h3>
                    <p className="text-sm opacity-90">{session.sessionType}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-brand-primary" />
                      {new Date(session.date).toLocaleDateString("es-ES")}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="h-4 w-4 mr-2 text-brand-primary" />
                      {session.location}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Camera className="h-4 w-4 mr-2 text-brand-primary" />
                      {session.totalPhotos} fotos
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <User className="h-4 w-4 mr-2 text-brand-primary" />
                      {session.photographer}
                    </div>
                  </div>
                  <Link href={`/galeria/${session.id}`}>
                    <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white group">
                      Ver Galería
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
