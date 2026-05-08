import { currentRole } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { NextResponse } from "next/server"

/**
 * Call at the top of any route handler that requires admin access.
 * Returns a 401/403 NextResponse if the request should be rejected,
 * or null if the caller may proceed.
 *
 * Usage:
 *   const guard = await requireAdmin()
 *   if (guard) return guard
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const role = await currentRole()

  if (!role) {
    return new NextResponse(null, { status: 401 })
  }

  if (role !== UserRole.ADMIN) {
    return new NextResponse(null, { status: 403 })
  }

  return null
}