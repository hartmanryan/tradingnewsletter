
// This script tests the Quentn API contact creation and term assignment.
// Run it with: node scripts/test-quentn.js <YOUR_API_KEY>

const apiKey = process.argv[2];
const baseUrl = "https://t03fbc.eu-3.quentn.com/public/api/v1";
const termName = "tradingnewsletter";
const testEmail = `test-${Date.now()}@example.com`;

if (!apiKey) {
    console.error("Please provide your Quentn API Key as an argument.");
    console.error("Usage: node scripts/test-quentn.js YOUR_API_KEY");
    process.exit(1);
}

async function runTest() {
    try {
        // 1. Get Term ID
        console.log(`Step 1: Fetching ID for term "${termName}"...`);
        const termRes = await fetch(`${baseUrl}/terms/${termName}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        const termData = await termRes.json();
        if (!termRes.ok || !termData.id) {
            console.error("❌ Failed to find term ID. Ensure the term exists in Quentn.");
            console.log("Response:", termData);
            return;
        }
        const termId = termData.id;
        console.log(`✅ Found Term ID: ${termId}`);

        // 2. Create Contact
        console.log(`Step 2: Creating contact ${testEmail}...`);
        const contactRes = await fetch(`${baseUrl}/contact`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact: { mail: testEmail }
            })
        });

        const contactData = await contactRes.json();
        if (!contactRes.ok || !contactData.id) {
            console.error("❌ Failed to create contact.");
            console.log("Response:", contactData);
            return;
        }
        const contactId = contactData.id;
        console.log(`✅ Created Contact ID: ${contactId}`);

        // 3. Assign Term
        console.log(`Step 3: Assigning term ID ${termId} to contact ID ${contactId}...`);
        const assignRes = await fetch(`${baseUrl}/contact/${contactId}/terms`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([parseInt(termId)])
        });

        if (assignRes.ok) {
            console.log("✅ Success! Term assigned and contact created.");
        } else {
            const assignData = await assignRes.text();
            console.error("❌ Failed to assign term.");
            console.log("Status:", assignRes.status);
            console.log("Response:", assignData);
        }

    } catch (error) {
        console.error("Unexpected error:", error);
    }
}

runTest();
