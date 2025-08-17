const fetch = require("node-fetch");

// Test the lists endpoint
async function testListsEndpoint() {
  try {
    // First test without auth to see if endpoint exists
    const response = await fetch("http://localhost:5001/api/lists");
    console.log("Status:", response.status);
    console.log("Response:", await response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testListsEndpoint();
