"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PhotoLightbox } from "@/components/photo-lightbox"
import { Camera, Calendar, MapPin, User, Download, Share2, Grid3X3, List, ArrowLeft, Heart, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

// Import data
import photoSessionsData from "@/data/photo-sessions.json"
import siteContent from "@/data/site-content.json"

export default function GaleriaPage() {
  const params = useParams()
  const sessionId = params.sessionId as string

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  // Find the session data
  const session = photoSessionsData.sessions.find((s) => s.id === sessionId)

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-white to-brand-secondary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Sesión no encontrada</h1>
          <Link href="/">
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get all unique tags
  const allTags = Array.from(new Set(session.photos.flatMap((photo) => photo.tags)))

  // Filter photos based on selected tags
  const filteredPhotos =
    selectedTags.length > 0
      ? session.photos.filter((photo) => selectedTags.some((tag) => photo.tags.includes(tag)))
      : session.photos

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % filteredPhotos.length)
  }

  const previousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)
  }

  const toggleFavorite = (photoId: string) => {
    setFavorites((prev) => (prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]))
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-white to-brand-secondary">
      {/* Header */}
      <header className="sticky top-0 w-full bg-white/90 backdrop-blur-md border-b border-brand-primary/20 z-40">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-brand-primary" />
            <span className="text-2xl font-serif font-bold text-brand-dark">{siteContent.brand.name}</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="text-slate-700 hover:text-brand-primary"
            >
              {viewMode === "grid" ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90 text-white">
              <Download className="h-4 w-4 mr-2" />
              Descargar Todo
            </Button>
          </div>
        </div>
      </header>

      {/* Session Info */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-slate-600 hover:text-brand-primary transition-colors mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-brand-secondary to-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-brand-primary" />
                  <div>
                    <h3 className="font-semibold text-brand-dark">{session.clientName}</h3>
                    <p className="text-sm text-slate-600">{session.sessionType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-brand-secondary to-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-brand-primary" />
                  <div>
                    <h3 className="font-semibold text-brand-dark">Fecha</h3>
                    <p className="text-sm text-slate-600">{new Date(session.date).toLocaleDateString("es-ES")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-brand-secondary to-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-8 w-8 text-brand-primary" />
                  <div>
                    <h3 className="font-semibold text-brand-dark">Ubicación</h3>
                    <p className="text-sm text-slate-600">{session.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-brand-secondary to-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Camera className="h-8 w-8 text-brand-primary" />
                  <div>
                    <h3 className="font-semibold text-brand-dark">Total Fotos</h3>
                    <p className="text-sm text-slate-600">{session.totalPhotos} imágenes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brand-dark flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </h3>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="text-slate-600 hover:text-brand-primary"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                    : "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                }`}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-brand-dark">
              Galería de Fotos
              {selectedTags.length > 0 && (
                <span className="text-lg font-normal text-slate-600 ml-2">
                  ({filteredPhotos.length} de {session.photos.length})
                </span>
              )}
            </h2>
            <div className="text-sm text-slate-600">{favorites.length > 0 && `${favorites.length} favoritas`}</div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={photo.thumbnail || "/placeholder.svg"}
                    alt={photo.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(photo.id)
                      }}
                      className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(photo.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium truncate">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPhotos.map((photo, index) => (
                <Card
                  key={photo.id}
                  className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-24 h-24 overflow-hidden flex-shrink-0">
                        <Image
                          src={photo.thumbnail || "/placeholder.svg"}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-brand-dark mb-1">{photo.caption}</h3>
                        <p className="text-sm text-slate-600 mb-2">{photo.filename}</p>
                        <div className="flex flex-wrap gap-1">
                          {photo.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(photo.id)
                        }}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Heart
                          className={`h-5 w-5 ${favorites.includes(photo.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Photo Lightbox */}
      <PhotoLightbox
        photos={filteredPhotos}
        currentIndex={currentPhotoIndex}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        onNext={nextPhoto}
        onPrevious={previousPhoto}
      />
    </div>
  )
}
