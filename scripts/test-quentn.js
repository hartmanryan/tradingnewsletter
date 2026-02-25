
// This script tests the Quentn API contact creation.
// Run it with: node scripts/test-quentn.js <YOUR_API_KEY>

const apiKey = process.argv[2];
const baseUrl = "https://t03fbc.eu-3.quentn.com/public/api/v1";
const testEmail = `test-${Date.now()}@example.com`;

if (!apiKey) {
    console.error("Please provide your Quentn API Key as an argument.");
    console.error("Usage: node scripts/test-quentn.js YOUR_API_KEY");
    process.exit(1);
}

async function runTest() {
    console.log(`Targeting: ${baseUrl}/contact`);
    console.log(`Test Email: ${testEmail}`);

    const payload = {
        contact: {
            mail: testEmail
        }
    };

    try {
        const response = await fetch(`${baseUrl}/contact`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Status Code:", response.status);
        console.log("Response Body:", JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log("✅ Success! Contact should be visible in Quentn.");
        } else {
            console.log("❌ Failed. Check the response body above for clues.");
        }
    } catch (error) {
        console.error("Network or parsing error:", error);
    }
}

runTest();
