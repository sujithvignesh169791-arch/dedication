import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import connectDB from '@/db/connect';
import { User } from '@/models/User';
import { PremiumSubscription } from '@/models/PremiumSubscription';
import { ActivityHistory } from '@/models/ActivityHistory';

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  await connectDB();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId || session.subscription_data?.metadata?.userId;
        const plan = session.metadata?.plan || 'monthly';
        
        if (userId) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          await PremiumSubscription.findOneAndUpdate(
            { userId },
            {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscription.id,
              plan,
              status: subscription.status,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
            { upsert: true, new: true }
          );

          await User.findByIdAndUpdate(userId, {
            isPremium: true,
            premiumExpiresAt: new Date(subscription.current_period_end * 1000)
          });
        }
        break;
      }
      
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const subDoc = await PremiumSubscription.findOne({ stripeSubscriptionId: subscription.id });
        
        if (subDoc) {
          subDoc.status = subscription.status;
          subDoc.currentPeriodStart = new Date(subscription.current_period_start * 1000);
          subDoc.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
          subDoc.cancelAtPeriodEnd = subscription.cancel_at_period_end;
          await subDoc.save();

          const isPremium = subscription.status === 'active' || subscription.status === 'trialing';
          await User.findByIdAndUpdate(subDoc.userId, {
            isPremium,
            premiumExpiresAt: isPremium ? new Date(subscription.current_period_end * 1000) : null
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subDoc = await PremiumSubscription.findOne({ stripeSubscriptionId: invoice.subscription });
        if (subDoc) {
          await ActivityHistory.create({
            userId: subDoc.userId,
            action: 'payment',
            resourceId: subDoc._id,
            resourceType: 'PremiumSubscription',
            metadata: { error: 'Payment failed' }
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler failed:', err);
    return NextResponse.json({ error: 'Webhook Handler Failed' }, { status: 500 });
  }
}
