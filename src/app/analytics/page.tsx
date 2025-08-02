'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface LogEntry {
  timestamp: string;
  location?: LocationData;
  userAgent?: string;
  ip?: string;
}

interface LinkData {
  originalUrl: string;
  createdAt: string;
  logs: LogEntry[];
}

interface AnalyticsData {
  [shortCode: string]: LinkData;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (!response.ok) {
        throw new Error('Falha ao buscar análises')
      }
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getLocationString = (location?: LocationData) => {
    if (!location) return 'Localização não disponível'
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
  }

  const getTotalClicks = () => {
    return Object.values(data).reduce((total, link) => total + link.logs.length, 0)
  }

  const getUniqueLocations = () => {
    const locations = new Set<string>()
    Object.values(data).forEach(link => {
      link.logs.forEach(log => {
        if (log.location) {
          locations.add(getLocationString(log.location))
        }
      })
    })
    return locations.size
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button onClick={fetchAnalytics} className="mt-4">
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel de Análises</h1>
            <p className="text-muted-foreground">
              Acompanhe seus links encurtados e análises de visitantes
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span>Criado por @iitslone</span>
              <div className="flex gap-2">
                <span>📷 Instagram</span>
                <span>🎵 TikTok</span>
                <span>📺 YouTube</span>
                <span>🎮 Twitch</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchAnalytics} variant="outline">
              Atualizar
            </Button>
            <Button onClick={() => window.location.href = '/'}>
              Criar Novo Link
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(data).length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalClicks()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Localizações Únicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getUniqueLocations()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Links List */}
        <div className="space-y-4">
          {Object.keys(data).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum link criado ainda.</p>
                <Button onClick={() => window.location.href = '/'} className="mt-4">
                  Criar Seu Primeiro Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            Object.entries(data).map(([shortCode, linkData]) => (
              <Card key={shortCode}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">/{shortCode}</CardTitle>
                      <CardDescription className="break-all">
                        {linkData.originalUrl}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {linkData.logs.length} cliques
                      </Badge>
                      <Badge variant="outline">
                        Criado {formatDate(linkData.createdAt)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                {linkData.logs.length > 0 && (
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium">Visitas Recentes</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {linkData.logs.slice(-5).reverse().map((log, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                            <div className="space-y-1">
                              <div className="font-medium">
                                {formatDate(log.timestamp)}
                              </div>
                              <div className="text-muted-foreground">
                                Localização: {getLocationString(log.location)}
                              </div>
                            </div>
                            {log.ip && (
                              <Badge variant="outline" className="text-xs">
                                {log.ip}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      {linkData.logs.length > 5 && (
                        <p className="text-xs text-muted-foreground">
                          Mostrando as 5 visitas mais recentes de {linkData.logs.length} no total
                        </p>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
