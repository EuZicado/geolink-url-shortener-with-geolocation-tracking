'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setShortUrl('')
    setCopied(false)

    if (!originalUrl.trim()) {
      setError('Por favor, digite uma URL')
      return
    }

    if (!validateUrl(originalUrl)) {
      setError('Por favor, digite uma URL válida (inclua http:// ou https://)')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao criar link encurtado')
      }

      setShortUrl(data.shortUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Falha ao copiar:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">GeoLink</h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Crie links encurtados com recursos avançados de rastreamento de geolocalização
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium">Criado por @iitslone</span>
            <div className="flex gap-4">
              <span>📷 Instagram</span>
              <span>🎵 TikTok</span>
              <span>📺 YouTube</span>
              <span>🎮 Twitch</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Criar Link Encurtado</CardTitle>
            <CardDescription>
              Digite sua URL abaixo para gerar um link encurtado que rastreia a localização dos visitantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="https://exemplo.com"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="text-lg h-12"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Gerando...' : 'Gerar Link Encurtado'}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {shortUrl && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Seu link encurtado:</span>
                  <Badge variant="secondary">Pronto para usar</Badge>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={shortUrl}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="shrink-0"
                  >
                    {copied ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Quando os visitantes clicarem neste link, sua localização será capturada antes de redirecioná-los para sua URL original.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <h3 className="font-semibold">Rastreamento de Localização</h3>
            <p className="text-sm text-muted-foreground">
              Capture automaticamente dados de geolocalização dos visitantes
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Redirecionamento Instantâneo</h3>
            <p className="text-sm text-muted-foreground">
              Redirecionamento perfeito para sua URL original
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Análises Prontas</h3>
            <p className="text-sm text-muted-foreground">
              Sistema de registro integrado para análises abrangentes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
