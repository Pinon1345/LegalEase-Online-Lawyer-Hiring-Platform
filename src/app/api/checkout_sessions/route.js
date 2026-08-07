import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { getUser } from '@/lib/api/session'

export async function POST() {
    try {
        const headersList = await headers();
        const origin = headersList.get('origin');
        const user = await getUser();

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            line_items: [
                {
                    // Provide the exact Price ID of the product you want to sell
                    price: 'price_1U1smNAx3SEU946cyWe3mhHY',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/dashboard/lawyer/verified-success?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/lawyer/manage-legal-profile?payment=cancelled`,
        });

        console.log(session);

        return NextResponse.json({ url: session.url })
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        )
    }
}