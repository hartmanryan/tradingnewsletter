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

        // Build the URL reliably: extract the pure origin (e.g. https://system.quentn.com) and append the exact Swagger path
        let quentnUrl = '';
        try {
            quentnUrl = new URL(quentnBaseUrl).origin + '/public/api/v1/contact';
        } catch (e) {
            console.error('Invalid QUENTN_BASE_URL format:', quentnBaseUrl);
            return NextResponse.json({ error: 'QUENTN_BASE_URL is not a valid URL.' }, { status: 500 });
        }

        try {
            // According to Quentn documentation, creating a contact requires specific field mapping
            const response = await fetch(quentnUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${quentnApiKey}`
                },
                body: JSON.stringify({
                    // The Contact API expects a "contact" object wrapping the data
                    contact: {
                        mail: email,
                        terms: ["tradingnewsletter"]
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                // Usually Quentn returns validation errors if the email format is rejected or the API URL is wrong (e.g., missing /cb/ or trigger IDs).
                console.error('Quentn API Error Response:', errorData, 'HTTP Status:', response.status);

                // If it's a 404, the user's base URL or endpoint shape is incorrect
                if (response.status === 404) {
                    return NextResponse.json({ error: 'Quentn endpoint not found. Ensure QUENTN_BASE_URL is correct and points to a valid API Trigger / contact endpoint.' }, { status: 404 });
                }

                return NextResponse.json({ error: `Quentn API rejected the request (${response.status}). Check Vercel logs for details.` }, { status: response.status });
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
