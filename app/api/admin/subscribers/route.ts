import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Subscriber from '@/models/Subscriber';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const search = searchParams.get('search');
    const subscribed = searchParams.get('subscribed');

    let query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (subscribed !== null && subscribed !== undefined && subscribed !== '') {
      query.subscribed = subscribed === 'true';
    }

    const subscribers = await Subscriber.find(query).sort({ createdAt: -1 });
    return NextResponse.json(subscribers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { email, subscribed } = await req.json();

    const subscriber = await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { 
        subscribed,
        unsubscribedAt: subscribed ? null : new Date()
      },
      { new: true }
    );

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    return NextResponse.json(subscriber);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await Subscriber.findOneAndDelete({ email: email.toLowerCase() });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
