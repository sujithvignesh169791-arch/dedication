import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json();
    if (plan !== 'monthly' && plan !== 'annual') {
      return NextResponse.json({ error: 'invalid_plan' }, { status: 400 });
    }

    const priceId = plan === 'monthly' 
      ? process.env.STRIPE_MONTHLY_PRICE_ID 
      : process.env.STRIPE_ANNUAL_PRICE_ID;

    if (!priceId) {
      throw new Error('Missing Stripe Price ID in environment variables');
    }

    // DEVELOPMENT BYPASS: If using the default placeholder Stripe key, mock the checkout
    if (process.env.STRIPE_SECRET_KEY === 'sk_test_...') {
      // Direct mock update to avoid needing a real Stripe account for local dev testing
      const connectDB = (await import('@/db/connect')).default;
      const { User } = await import('@/models/User');
      await connectDB();
      await User.findByIdAndUpdate(session.user.id, { isPremium: true });
      return NextResponse.json({ checkoutUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/premium/success?session_id=mock_session_123` });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: session.user.email || undefined,
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      metadata: { userId: session.user.id, plan },
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/premium?cancelled=true`,
      subscription_data: {
        metadata: { userId: session.user.id, plan }
      }
    });

    return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'server_error', message: error.message }, { status: 500 });
  }
}
