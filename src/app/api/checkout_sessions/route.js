import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '../../../lib/stripe';
import { getUser } from '@/lib/api/session';

export async function POST(req) {
    try {
        const headersList = await headers();
        const origin = headersList.get('origin');
        const body = await req.json();

        // 1. Properly extract string variables instead of assigning whole `body` object to `type`

        const type = body?.type || body?.paymentType || "booking";

        const user = await getUser();

        let lineObj;
        let metaObj;

        if (type === "verification") {
            lineObj = {
                price: 'price_1U1smNAx3SEU946cyWe3mhHY',
                quantity: 1,
            };

            // Convert all metadata values explicitly to Strings

            metaObj = {
                email: String(user?.email || ""),
                userId: String(user?.id || ""),
                paymentType: "verification"
            };
        } else {
            lineObj = {
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(Number(body?.totalAmount || 0) * 100),
                    product_data: {
                        name: body?.lawyerName || "Legal Consultation"
                    }
                },
                quantity: 1,
            };

            // Convert ALL metadata properties explicitly to string values (Stripe requirement)

            metaObj = {
                email: String(user?.email || ""),
                userId: String(user?.id || ""),
                lawyerId: String(body?.lawyerId || ""),
                paymentType: String(type),
                amount: String(body?.totalAmount || ""),
                lawyerName: String(body?.lawyerName || ""),
                selectedDate: String(body?.selectedDate || ""),
                selectedTimeSlot: String(body?.selectedTimeSlot || ""),
                paymentStatus: String(body?.paymentStatus || "paid"),
                transactionId: String(body?.transactionId || "")
            };
        }

        const successUrl = type === "verification"
            ? `${origin}/dashboard/lawyer/verified-success?payment=success&session_id={CHECKOUT_SESSION_ID}`
            : `${origin}/payment-success?payment=success&session_id={CHECKOUT_SESSION_ID}`;


        const cancelUrl = type === "verification"
            ? `${origin}/dashboard/lawyer/verified-cancel?payment=cancelled`
            : `${origin}/lawyers/booking-cancel?payment=cancelled`

        // Create Stripe Checkout Session

        const session = await stripe.checkout.sessions.create({
            customer_email: user?.email,
            line_items: [lineObj],
            metadata: metaObj,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return NextResponse.json({ url: session.url });

    } catch (err) {
        console.error("Stripe Checkout Error:", err);
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}