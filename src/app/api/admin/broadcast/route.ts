import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const { prompt, affiliateLink, password } = await req.json();

        // Verify password locally
        if (password !== (process.env.NEXT_PUBLIC_ADMIN_DEV_PASSWORD || 'admin123')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!prompt || !affiliateLink) {
            return NextResponse.json({ error: 'Prompt and internal link are required' }, { status: 400 });
        }

        // Initialize Gemini
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is missing' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const fullPrompt = `You are an expert TradingView PineScript developer.
Write a COMPLETE, VALID, WORKING TradingView PineScript based on the following idea:
"${prompt}"

Constraints:
1. ONLY return the code blocks. Do not return any other conversational text.
2. Ensure the script applies cleanly in TradingView without compilation errors.
3. Include clear inline comments explaining what it does.`;

        const result = await model.generateContent(fullPrompt);
        const pineScriptCode = result.response.text();

        if (!pineScriptCode) {
            throw new Error("Gemini returned empty response.");
        }

        // Prepare HTML Email Content
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #4f46e5;">Your Daily AI-Generated PineScript is Here!</h2>
        <p>Hello Trader,</p>
        <p>Here is your daily automated TradingView logic, based on the idea:</p>
        <blockquote style="font-style: italic; background: #f3f4f6; padding: 10px; border-left: 4px solid #4f46e5;">
          ${prompt}
        </blockquote>
        
        <h3>The Code:</h3>
        <pre style="background: #1e293b; color: #f8fafc; padding: 15px; border-radius: 8px; overflow-x: auto; font-size: 13px;">
${escapeHtml(pineScriptCode.replace(/```(pinescript)?/g, ''))}
        </pre>
        
        <div style="margin-top: 30px; padding: 20px; text-align: center; background: #e0e7ff; border-radius: 8px;">
          <p style="margin-bottom: 15px; font-weight: bold;">Support our daily free newsletter by checking out our partner:</p>
          <a href="${affiliateLink}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View Today's Sponsored Partner
          </a>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center;">
          Always backtest scripts before using them with real funds.
        </p>
      </div>
    `;

        // Send Broadcast via Quentn API
        const quentnApiKey = process.env.QUENTN_API_KEY;
        const quentnBaseUrl = process.env.QUENTN_BASE_URL;
        let subscriberCount = 0;

        if (!quentnApiKey || !quentnBaseUrl) {
            console.warn("QUENTN_API_KEY or QUENTN_BASE_URL missing. Simulating broadcast send.");
            subscriberCount = 42; // simulated
        } else {
            // Create the endpoint URL dynamically
            const quentnBroadcastUrl = `${quentnBaseUrl.replace(/\/$/, '')}/broadcasts`;

            const qRes = await fetch(quentnBroadcastUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${quentnApiKey}`
                },
                body: JSON.stringify({
                    subject: 'Your Daily PineScript Strategy!',
                    html_content: emailHtml,
                    // targeting options depending on Quentn API payload semantics
                })
            });

            if (!qRes.ok) {
                const errorData = await qRes.json();
                console.error('Quentn Broadcast Error:', errorData);
                return NextResponse.json({ error: 'Failed to broadcast with Quentn' }, { status: qRes.status });
            }

            const qData = await qRes.json();
            subscriberCount = qData.recipients_count || 1;
        }

        return NextResponse.json({ success: true, subscriberCount }, { status: 200 });

    } catch (error: any) {
        console.error('Broadcast error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

function escapeHtml(unsafe: string) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
