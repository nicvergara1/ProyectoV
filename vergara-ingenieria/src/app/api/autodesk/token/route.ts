import { NextResponse } from 'next/server'

// Tipos para el token cacheado
type TokenCache = {
  token: string
  expiresAt: number // timestamp en millisegundos
}

// Cache global del token (persiste en el runtime del servidor)
let cachedToken: TokenCache | null = null

// Constante para el buffer de tiempo antes de que expire el token
const TOKEN_EXPIRY_BUFFER = 60000 // 1 minuto en ms

/**
 * GET /api/autodesk/token
 *
 * Obtiene un Access Token de Autodesk Platform Services (APS)
 * usando OAuth 2-legged authentication (Client Credentials).
 *
 * El token es cacheado en memoria para evitar requests innecesarios.
 *
 * @returns {access_token: string, expires_in: number}
 */
export async function GET() {
  try {
    const now = Date.now()

    // Verificar si hay un token cacheado válido
    if (cachedToken && cachedToken.expiresAt > now + TOKEN_EXPIRY_BUFFER) {
      console.log('[APS Token] Usando token cacheado')
      return NextResponse.json({
        access_token: cachedToken.token,
        expires_in: Math.floor((cachedToken.expiresAt - now) / 1000), // segundos restantes
        cached: true
      })
    }

    // Si no hay token válido, obtener uno nuevo de Autodesk
    console.log('[APS Token] Obteniendo nuevo token de Autodesk')

    const clientId = process.env.APS_CLIENT_ID
    const clientSecret = process.env.APS_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('APS_CLIENT_ID y APS_CLIENT_SECRET deben estar configurados en .env.local')
    }

    // Hacer request a Autodesk para obtener token
    const response = await fetch('https://developer.api.autodesk.com/authentication/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
        scope: 'data:read data:write data:create bucket:create bucket:read'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[APS Token] Error de Autodesk:', errorText)
      throw new Error(`Autodesk authentication failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()

    // Cachear el token
    cachedToken = {
      token: data.access_token,
      expiresAt: now + (data.expires_in * 1000) // convertir segundos a ms
    }

    console.log('[APS Token] Nuevo token obtenido y cacheado. Expira en', data.expires_in, 'segundos')

    return NextResponse.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
      cached: false
    })

  } catch (error: any) {
    console.error('[APS Token] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get Autodesk token' },
      { status: 500 }
    )
  }
}

/**
 * Helper function para obtener token (usado por otras API routes)
 *
 * @returns Promise<string> - Access token
 */
export async function getApsToken(): Promise<string> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/autodesk/token`)

  if (!response.ok) {
    throw new Error('Failed to get APS token')
  }

  const data = await response.json()
  return data.access_token
}
