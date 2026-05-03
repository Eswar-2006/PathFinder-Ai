import { HfInference } from "@huggingface/inference";

/**
 * Hugging Face Inference API Service
 * Models: 
 * - Vision: Qwen/Qwen2.5-VL-72B-Instruct
 */

export const analyzeImageHF = async (base64Image: string) => {
    const apiKey = (import.meta as any).env?.VITE_HF_TOKEN;

    if (!apiKey) {
        console.warn("Hugging Face API Key is missing. Trying unauthenticated request (may be rate limited).");
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

        return response.choices[0]?.message?.content || "I can see an image but I'm having trouble describing it.";
    } catch (error) {
        console.error("Hugging Face Error:", error);
        return null; // Fallback to Gemini
    }
};
