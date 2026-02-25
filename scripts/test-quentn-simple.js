
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testQuentn() {
    const apiKey = process.env.QUENTN_API_KEY;
    const baseUrl = "https://t03fbc.eu-3.quentn.com/public/api/v1";
    const email = "test-" + Date.now() + "@example.com";

    console.log("Testing Quentn API...");
    console.log("URL:", `${baseUrl}/contact`);
    console.log("Email:", email);

    try {
        const response = await axios.post(`${baseUrl}/contact`, {
            contact: {
                mail: email
            }
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Status:", response.status);
        console.log("Data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error Detail:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testQuentn();
