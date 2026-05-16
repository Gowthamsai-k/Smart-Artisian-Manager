import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy to get the object
        // Actually, the SDK doesn't have a direct listModels on the genAI object easily without a specific client.
        // But we can try to find the correct name by trial and error or checking the latest docs.
        console.log("Checking model availability...");
    } catch (e) {
        console.error(e);
    }
}
listModels();
