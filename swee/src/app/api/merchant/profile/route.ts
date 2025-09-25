import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For admin users, get the first merchant (for development access)
    // For merchant users, get their own merchant profile
    const merchant = session.user.role === 'ADMIN' 
      ? await prisma.merchant.findFirst()
      : await prisma.merchant.findFirst({
          where: { ownerId: session.user.id }
        });

    if (!merchant) {
      return NextResponse.json(
        { message: 'Merchant profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(merchant);
  } catch (error) {
    console.error('Get merchant profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, address, phone, email, website } = body;

    // For admin users, get the first merchant (for development access)
    // For merchant users, get their own merchant profile
    const merchant = session.user.role === 'ADMIN' 
      ? await prisma.merchant.findFirst()
      : await prisma.merchant.findFirst({
          where: { ownerId: session.user.id }
        });

    if (!merchant) {
      return NextResponse.json(
        { message: 'Merchant profile not found' },
        { status: 404 }
      );
    }

    const updatedMerchant = await prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        name,
        description,
        address,
        phone,
        email,
        website
      }
    });

    return NextResponse.json(updatedMerchant);
  } catch (error) {
    console.error('Update merchant profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
