'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
}

export default function RedirectPage() {
  const params = useParams()
  const shortCode = params.shortCode as string
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error' | 'not-found'>('loading')
  const [originalUrl, setOriginalUrl] = useState<string>('')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!shortCode) {
      setStatus('error')
      return
    }

    const processRedirect = async () => {
      try {
        // First, verify the short code exists and get the original URL
        const response = await fetch(`/api/verify/${shortCode}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setStatus('not-found')
          } else {
            setStatus('error')
          }
          return
        }

        const data = await response.json()
        setOriginalUrl(data.originalUrl)
        setStatus('redirecting')

        // Try to get geolocation
        const getLocation = (): Promise<LocationData | null> => {
          return new Promise((resolve) => {
            if (!navigator.geolocation) {
              resolve(null)
              return
            }

            const timeoutId = setTimeout(() => {
              resolve(null)
            }, 3000) // 3 second timeout

            navigator.geolocation.getCurrentPosition(
              (position) => {
                clearTimeout(timeoutId)
                resolve({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  accuracy: position.coords.accuracy
                })
              },
              (error) => {
                clearTimeout(timeoutId)
                console.log('Geolocation error:', error.message)
                resolve(null)
              },
              {
                enableHighAccuracy: true,
                timeout: 3000,
                maximumAge: 60000
              }
            )
          })
        }

        // Get location and log it
        const location = await getLocation()
        
        // Log the visit (with or without location)
        try {
          await fetch('/api/log', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shortCode,
              location
            }),
          })
        } catch (logError) {
          console.error('Failed to log visit:', logError)
          // Continue with redirect even if logging fails
        }

        // Start countdown and redirect
        let timeLeft = 3
        setCountdown(timeLeft)
        
        const countdownInterval = setInterval(() => {
          timeLeft--
          setCountdown(timeLeft)
          
          if (timeLeft <= 0) {
            clearInterval(countdownInterval)
            window.location.href = data.originalUrl
          }
        }, 1000)

      } catch (error) {
        console.error('Error processing redirect:', error)
        setStatus('error')
      }
    }

    processRedirect()
  }, [shortCode])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <h2 className="text-xl font-semibold">Processando Link...</h2>
            <p className="text-muted-foreground">
              Aguarde enquanto preparamos seu redirecionamento
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'not-found') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-6xl">🔗</div>
            <h2 className="text-2xl font-bold">Link Não Encontrado</h2>
            <p className="text-muted-foreground">
              O link encurtado que você está procurando não existe ou pode ter expirado.
            </p>
            <a 
              href="/" 
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Criar Novo Link
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.
              </AlertDescription>
            </Alert>
            <a 
              href="/" 
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Ir para Início
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Redirecting status
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="text-4xl">🌍</div>
            <h2 className="text-xl font-semibold">Preparando Redirecionamento</h2>
            <p className="text-muted-foreground">
              Localização capturada para análises. Redirecionando em {countdown} segundos...
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Redirecionando para:</div>
            <div className="p-2 bg-muted rounded text-sm font-mono break-all">
              {originalUrl}
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            ></div>
          </div>

          <button
            onClick={() => window.location.href = originalUrl}
            className="text-sm text-primary hover:underline"
          >
            Pular contagem e redirecionar agora
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
