// Run with: npx ts-node scripts/testAgent.ts
import axios from "axios";
async function main() {
    try {
        const res = await axios.post("http://localhost:3000/agent", { message: "Close Kyiv branch on Sundays" }, { timeout: 5000 });
        console.log("Response status:", res.status);
        console.log("Response data:", JSON.stringify(res.data, null, 2));
    }
    catch (err) {
        if (err.response) {
            console.error("Error response status:", err.response.status);
            console.error("Error response data:", JSON.stringify(err.response.data, null, 2));
        }
        else {
            console.error("Request failed:", err.message);
        }
        process.exitCode = 1;
    }
}
main();
