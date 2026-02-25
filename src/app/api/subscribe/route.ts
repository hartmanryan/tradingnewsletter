import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Replace this section with actual Quentn API endpoints and payload structures
        // documentation: https://quentn.com/api
        const quentnApiKey = process.env.QUENTN_API_KEY;
        const quentnSystemId = process.env.QUENTN_SYSTEM_ID;

        if (!quentnApiKey) {
            console.warn("QUENTN_API_KEY is missing. Simulating successful subscription.");
            // For local testing without an API key, simulate success
            return NextResponse.json({ success: true, message: 'Simulated subscription' }, { status: 200 });
        }

        // Example conceptual Quentn API call to add to a list.
        const response = await fetch(`https://api.quentn.com/public/v1/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${quentnApiKey}`
            },
            body: JSON.stringify({
                mail: email,
                // other required fields or tags to trigger standard campaigns
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Quentn API Error:', errorData);
            return NextResponse.json({ error: 'Failed to subscribe with Quentn' }, { status: response.status });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
