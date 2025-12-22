import { NextResponse } from 'next/server';
import { ROLE_LOGIN_PATHS, ROLE_DASHBOARD_PATHS, getRoleFromPath, UserRole } from './src/lib/constants/roles';

/**
 * Middleware for route protection
 * Protects routes that require authentication
 * Works with all user roles
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;
  
  // Check if this is a protected route (dashboard routes)
  const isProtectedRoute = pathname.includes('/dashboard');
  
  // Check if this is a guest route (login, signup, forgot-password, root)
  const isGuestRoute = 
    pathname.includes('/login') ||
    pathname.includes('/signup') ||
    pathname.includes('/forgot-password') ||
    pathname === '/';

  // Get role from path
  const routeRole = getRoleFromPath(pathname);

  // Redirect /starter to root page
  if (pathname === '/starter') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect dashboard routes - redirect to root if not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect authenticated users away from guest routes
  if (isGuestRoute && isAuthenticated) {
    // Try to get role from cookie or infer from path
    const userRole = request.cookies.get('user_role')?.value || routeRole;
    
    if (userRole && ROLE_DASHBOARD_PATHS[userRole]) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARD_PATHS[userRole], request.url));
    }
    
    // Default to property-manager dashboard
    return NextResponse.redirect(new URL(ROLE_DASHBOARD_PATHS[UserRole.PROPERTY_MANAGER], request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logos, svg, images, videos (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logos|svg|images|videos).*)',
  ],
};

