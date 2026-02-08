import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function proxy(req) {
     const token = await getToken({ req })
     const Priveateroute = ['/private', '/dasboard', '/secret']
     const IsAuthenticated = Boolean(token)
     const IsUser = token?.role === 'user'
     const reqPath = req.nextUrl.pathname
     const AdminRoutes = ['/adDashboard']
     // console.log(reqPath)
     const IsPrivate = Priveateroute.some(route => reqPath.startsWith(route))
     const IsAdmin = token?.role === 'admin'
     const IsAdminRoutes = AdminRoutes.some(req => reqPath.startsWith(req))

     if (!IsAuthenticated && IsPrivate) {
          const loginUrl = new URL('/api/auth/signin', req.url)
          loginUrl.searchParams.set('callbackUrl', reqPath)
          return NextResponse.redirect(loginUrl)
     }
     if (IsAuthenticated && !IsAdmin && !IsAdminRoutes) {
          return NextResponse.redirect(new URL('/app/forbidden', req.url))
     }
     return NextResponse.next()
}


export const config = {
     matcher: ['/public/:path*', '/adDashboard/:path*'],
} 