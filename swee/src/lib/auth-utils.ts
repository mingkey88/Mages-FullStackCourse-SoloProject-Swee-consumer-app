import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Check if user has merchant or admin access
 */
export function hasmerchantAccess(role?: string): boolean {
  return role === 'MERCHANT' || role === 'ADMIN';
}

/**
 * Check if user has admin access
 */
export function hasAdminAccess(role?: string): boolean {
  return role === 'ADMIN';
}

/**
 * Get authenticated session with role check
 * Returns the session if user has required role, otherwise throws with appropriate response
 */
export async function requireMerchantAccess() {
  const session = await getServerSession(authOptions);
  
  if (!session || !hasmerchantAccess(session.user?.role)) {
    throw NextResponse.json(
      { message: 'Unauthorized - Merchant or Admin access required' },
      { status: 401 }
    );
  }
  
  return session;
}

/**
 * Get authenticated session with admin check
 * Returns the session if user has admin role, otherwise throws with appropriate response
 */
export async function requireAdminAccess() {
  const session = await getServerSession(authOptions);
  
  if (!session || !hasAdminAccess(session.user?.role)) {
    throw NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }
  
  return session;
}

/**
 * Get merchant profile for current user
 * For ADMIN users, allows access to any merchant by merchantId parameter
 * For MERCHANT users, returns their own merchant profile
 */
export async function getMerchantForUser(session: any, merchantId?: number) {
  if (session.user.role === 'ADMIN') {
    // Admin can access any merchant
    if (merchantId) {
      return await prisma.merchant.findUnique({
        where: { id: merchantId }
      });
    }
    // If no merchantId specified, return first merchant for admin (for compatibility)
    return await prisma.merchant.findFirst();
  } else {
    // Regular merchant can only access their own profile
    return await prisma.merchant.findFirst({
      where: { ownerId: session.user.id }
    });
  }
}