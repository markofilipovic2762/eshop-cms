import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("user")?.value

  // Define paths that require authentication
  const isAuthPath = request.nextUrl.pathname.startsWith("/dashboard")

  // If trying to access dashboard without being logged in
  if (isAuthPath && !currentUser) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Match all dashboard routes
    "/dashboard/:path*",
  ],
}
