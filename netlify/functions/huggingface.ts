import { HfInference } from "@huggingface/inference";

export const handler = async (event: any) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { base64Image } = JSON.parse(event.body || "{}");
    const apiKey = process.env.VITE_HF_TOKEN;

    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ error: "Hugging Face API Key is missing." }) };
    }

    try {
        const hf = new HfInference(apiKey);
        
        // Ensure base64 format is correct for the API
        const base64Data = base64Image.includes(',') ? base64Image : `data:image/jpeg;base64,${base64Image}`;

        const response = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-VL-72B-Instruct",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Describe this image in detail, focusing on any text, certificates, charts, or career-related content." },
                        { type: "image_url", image_url: { url: base64Data } }
                    ]
                }
            ],
            max_tokens: 300
        });

        const text = response.choices[0]?.message?.content || "I can see an image but I'm having trouble describing it.";
        
        return {
            statusCode: 200,
            body: JSON.stringify({ text })
        };
    } catch (error: any) {
        console.error("Hugging Face Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Failed to analyze image" })
        };
    }
};
