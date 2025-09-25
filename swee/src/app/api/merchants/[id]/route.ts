import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const merchantId = Number(params.id);
  if (isNaN(merchantId)) {
    return NextResponse.json({ error: 'Invalid merchant id' }, { status: 400 });
  }
  try {
    // Fetch merchant and related services
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      include: {
        services: true,
      },
    });
    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }
    // Fetch feedbacks for this merchant via bookings
    const bookings = await prisma.booking.findMany({
      where: { merchantId },
      include: { feedback: true, service: true, user: true },
    });
    const feedbacks = bookings
      .map(b => b.feedback)
      .filter(fb => fb !== null);
    const averageRating = feedbacks.length > 0
      ? feedbacks.reduce((sum, fb) => sum + (fb?.rating ?? 0), 0) / feedbacks.length
      : 0;
    // Format reviews
    const reviews = feedbacks.map((fb, i) => ({
      id: fb!.id,
      user: {
        name: bookings[i].user.name ?? 'Anonymous',
        initial: bookings[i].user.name ? bookings[i].user.name[0] : 'A',
      },
      rating: fb!.rating,
      comment: fb!.comment ?? '',
      date: fb!.createdAt,
      service: bookings[i].service.title,
    }));
    // Format services
    const services = merchant.services.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      duration: s.duration ?? 0,
      price: s.price,
      category: s.category,
      tags: [], // Add tags if needed
    }));
    const response = {
      id: merchant.id,
      name: merchant.name,
      description: merchant.description ?? '',
      address: merchant.address ?? '',
      phone: merchant.phone ?? '',
      email: merchant.email ?? '',
      website: merchant.website ?? '',
      trustScore: merchant.trustScore ?? 0,
      averageRating,
      reviewCount: reviews.length,
      services,
      reviews,
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}
