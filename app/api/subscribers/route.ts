import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Subscriber from '@/models/Subscriber';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, phone, source, preferences } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Upsert subscriber
    const subscriber = await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $set: {
          name,
          phone,
          source: source || 'footer',
          subscribed: true,
          preferences: preferences || {
            blogUpdates: true,
            productUpdates: true,
            offers: true,
            phoneNotifications: false,
          },
          lastSubscribedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, subscriber });
  } catch (error: any) {
    console.error('Subscriber API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
