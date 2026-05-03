export const analyzeImageHF = async (base64Image: string) => {
    try {
        const response = await fetch('/.netlify/functions/huggingface', {
            method: 'POST',
            body: JSON.stringify({ base64Image }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error("Hugging Face API returned an error:", await response.text());
            return null; // Fallback to Gemini
        }

        const data = await response.json();
        return data.text || "I can see an image but I'm having trouble describing it.";
    } catch (error) {
        console.error("Hugging Face Error:", error);
        return null; // Fallback to Gemini
    }
};
