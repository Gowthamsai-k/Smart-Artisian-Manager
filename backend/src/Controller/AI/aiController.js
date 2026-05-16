import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

export const ChatWithAI = async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!process.env.GROQ_API_KEY) {
            console.error("AI Error: GROQ_API_KEY is not defined in process.env");
            return res.status(500).json({
                success: false,
                message: "AI Configuration Error: GROQ_API_KEY is missing from the server environment."
            });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const systemPrompt = `
        You are an expert Artisan Business Consultant for "ArtisanFlow". 
        Your goal is to help artisans improve their product quality, pricing strategies, and market research.

        Available Data:
        - Current Inventory: ${JSON.stringify(context?.inventory || [])}
        - Product Catalog: ${JSON.stringify(context?.products || [])}
        - Current App Location: ${context?.currentPath}
        
        Rules:
        1. Be encouraging, professional, and sophisticated.
        2. Provide your advice in 3-4 very brief bullet points.
        3. ALWAYS use the "Available Data" to give specific answers.
        4. Use markdown for brief formatting.
        5. Give prices in INR (₹).
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content || "I couldn't generate a response.";

        res.status(200).json({
            success: true,
            reply: reply
        });

    } catch (error) {
        console.error("GROQ CHAT ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Groq AI Error: " + (error.message || "Service Busy")
        });
    }
};

export const PredictPrice = async (req, res) => {
    try {
        const { description, materialsUsed, category, image, inventory } = req.body;

        if (!process.env.GROQ_API_KEY) {
            console.error("AI Prediction Error: GROQ_API_KEY is missing");
            return res.status(500).json({
                success: false,
                message: "AI Configuration Error: GROQ_API_KEY not found."
            });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // Select model based on image presence
        const modelToUse = "meta-llama/llama-4-scout-17b-16e-instruct";
        console.log(`Using AI model: ${modelToUse} (Image present: ${!!image})`);

        const promptText = `Return ONLY a JSON object. No markdown. No extra text.
        You are an expert artisan marketplace consultant. Analyze the product details below to generate a listing.
        
        Fields to predict:
        - name: A professional name for the product.
        - category: One of [Ceramics, Woodwork, Textiles, Jewelry, Glassware, Leather, Other].
        - description: A detailed sales description.
        - suggestedPrice: A profitable price in INR (ensure at least 40% margin over costs).
        - reasoning: Brief logic for this price in 3-4 concise bullet points.

        Context:
        - Category: ${category || "Unknown"}
        - Description: ${description || "N/A"}
        - Materials: ${JSON.stringify(materialsUsed)}
        - Inventory Costs: ${JSON.stringify(inventory)}
        
        JSON Format: {"name": "string", "category": "string", "description": "string", "suggestedPrice": number, "reasoning": "string"}`;

        const messages = [
            {
                role: "user",
                content: [
                    { type: "text", text: promptText },
                ]
            }
        ];

        if (image) {
            messages[0].content.push({
                type: "image_url",
                image_url: { url: image }
            });
        }

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: modelToUse,
            response_format: { type: "json_object" },
            temperature: 0.1,
            max_tokens: 1024
        });

        const responseText = completion.choices[0]?.message?.content;
        console.log("AI Response received");

        if (!responseText) throw new Error("Empty response from AI service");

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseErr) {
            const match = responseText.match(/\{[\s\S]*\}/);
            if (match) data = JSON.parse(match[0]);
            else throw new Error("Could not parse AI response");
        }

        res.status(200).json({
            success: true,
            name: data.name || "",
            category: data.category || category,
            description: data.description || description,
            suggestedPrice: data.suggestedPrice || 0,
            reasoning: data.reasoning || "Generated by AI analysis."
        });

    } catch (error) {
        console.error("GROQ PREDICTION ERROR:", error);

        let errorMessage = error.message || "AI Suggestion Failed";
        if (error.status === 413) errorMessage = "Image too large for AI analysis.";
        if (error.status === 429) errorMessage = "AI is busy (Rate limit reached). Please wait 60s.";

        res.status(500).json({
            success: false,
            message: errorMessage,
            suggestedPrice: 0,
            reasoning: "The AI service encountered an error. This usually happens if the image is too large or the service is overloaded."
        });
    }
};
