import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip middleware for API routes and static files
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if user is already authenticated
  const authCookie = request.cookies.get('auth-token')
  const expectedPassword = process.env.DEMO_PASSWORD || 'flimmer2024##2025##'
  
  if (authCookie?.value === expectedPassword) {
    return NextResponse.next()
  }

  // Check for password in URL params (for login)
  const password = request.nextUrl.searchParams.get('password')
  if (password === expectedPassword) {
    const response = NextResponse.next()
    response.cookies.set('auth-token', password, {
      maxAge: 24 * 60 * 60, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })
    
    // Redirect to clean URL without password parameter
    const cleanUrl = new URL(request.nextUrl)
    cleanUrl.searchParams.delete('password')
    return NextResponse.redirect(cleanUrl)
  }

  // Show password prompt
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Flimmer Demo Access</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 90%;
            text-align: center;
          }
          .logo {
            font-size: 2rem;
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 1rem;
          }
          h1 {
            color: #1f2937;
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
          }
          .subtitle {
            color: #6b7280;
            margin-bottom: 2rem;
            font-size: 0.9rem;
          }
          input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            margin-bottom: 1rem;
            box-sizing: border-box;
            transition: border-color 0.2s;
          }
          input:focus {
            outline: none;
            border-color: #4f46e5;
          }
          button {
            width: 100%;
            background: #4f46e5;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          button:hover {
            background: #4338ca;
          }
          .note {
            margin-top: 1.5rem;
            padding: 1rem;
            background: #f3f4f6;
            border-radius: 8px;
            font-size: 0.8rem;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🎬 Flimmer</div>
          <h1>Demo Access</h1>
          <p class="subtitle">Enter password to view the admin dashboard</p>
          
          <form method="GET">
            <input 
              type="password" 
              name="password" 
              placeholder="Enter demo password"
              autofocus
              required
            />
            <button type="submit">Access Dashboard</button>
          </form>
          
          <div class="note">
            <strong>Demo Note:</strong> This is a password-protected demonstration of the Flimmer admin platform featuring AI content moderation, user management, and business analytics.
          </div>
        </div>
        
        <script>
          // Auto-focus password field
          document.querySelector('input[name="password"]').focus();
        </script>
      </body>
    </html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 