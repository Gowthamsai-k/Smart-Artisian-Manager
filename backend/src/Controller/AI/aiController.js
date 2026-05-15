import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY");

export const ChatWithAI = async (req, res) => {
    try {
        const { message, context } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an expert Artisan Business Consultant for "ArtisanFlow". 
        Your goal is to help artisans improve their product quality, pricing strategies, and market research.

        Context: ${JSON.stringify(context || {})}
        
        User Message: ${message}

        Rules:
        1. Be encouraging, professional, and sophisticated.
        2. If the user asks about pricing, consider the "materialsUsed" in the context if provided.
        3. If the user asks about quality, give specific artisan-focused advice (e.g., finishing, durability, storytelling).
        4. Keep responses concise and formatted with markdown.
        5. If the user asks for market research, simulate a brief analysis based on current trends in their category.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            success: true,
            reply: text
        });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({
            success: false,
            message: "I'm having trouble thinking right now. Please try again later.",
            error: error.message
        });
    }
};
