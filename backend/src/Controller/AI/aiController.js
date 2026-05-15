import { GoogleGenerativeAI } from "@google/generative-ai";

export const ChatWithAI = async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            console.error("AI Error: Missing API Key");
            return res.status(500).json({ success: false, message: "Server configuration error: Missing AI Key" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        You are an expert Artisan Business Consultant for "ArtisanFlow". 
        Your goal is to help artisans improve their product quality, pricing strategies, and market research.

        Available Data:
        - Current Inventory: ${JSON.stringify(context?.inventory || [])}
        - Product Catalog: ${JSON.stringify(context?.products || [])}
        - Current App Location: ${context?.currentPath}
        
        User Message: ${message}

        Rules:
        1. Be encouraging, professional, and sophisticated.
        2. Keep responses VERY SHORT and CONCISE (maximum 60 words).
        3. ALWAYS use the "Available Data" to give specific answers. E.g., if asked about price, look at the material costs/names in the inventory.
        4. If asked about quality, give specific advice related to their catalog items.
        5. Use markdown for brief formatting.
        6. Always focus on practical, actionable steps.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || result.response.text() || "I couldn't generate a response.";

        res.status(200).json({
            success: true,
            reply: text
        });

    } catch (error) {
        console.error("AI Backend Error:", error);
        res.status(500).json({
            success: false,
            message: "AI Error: " + error.message
        });
    }
};
