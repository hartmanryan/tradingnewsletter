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

        // Quentn requires a tailored base URL (e.g., https://yourbase.quentn.com/api/v1)
        const quentnBaseUrl = process.env.QUENTN_BASE_URL;

        if (!quentnApiKey || !quentnBaseUrl) {
            console.warn("QUENTN_API_KEY or QUENTN_BASE_URL is missing. Simulating successful subscription.");
            return NextResponse.json({ success: true, message: 'Simulated subscription' }, { status: 200 });
        }

        // The endpoint is appended to the user-specific base URL
        const quentnUrl = `${quentnBaseUrl.replace(/\/$/, '')}/contacts`;

        try {
            const response = await fetch(quentnUrl, {
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
                const errorData = await response.text(); // Read as text in case it's not JSON
                console.error('Quentn API Error Response:', errorData);
                return NextResponse.json({ error: 'Failed to subscribe with Quentn. Please check your API configuration.' }, { status: response.status });
            }
        } catch (fetchError: any) {
            console.error('Fetch to Quentn failed directly:', fetchError);
            return NextResponse.json({ error: 'Failed to connect to Quentn API. Please verify the endpoint URL.' }, { status: 502 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
