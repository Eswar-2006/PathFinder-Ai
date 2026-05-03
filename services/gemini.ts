export const getGeminiResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], imageData?: string, language: string = 'English') => {
    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            body: JSON.stringify({
                prompt,
                history,
                imageData,
                language,
                isStream: false
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error: any) {
        console.error("AI API Error:", error);
        return `Error: ${error.message || "Failed to connect to AI service."}`;
    }
};

export const getGeminiStream = async (
    prompt: string,
    history: { role: 'user' | 'model', parts: { text: string }[] }[],
    onChunk: (text: string) => void,
    imageData?: string,
    language: string = 'English'
) => {
    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            body: JSON.stringify({
                prompt,
                history,
                imageData,
                language,
                isStream: true
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
            throw new Error("ReadableStream not yet supported in this browser.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            onChunk(chunk);
        }

    } catch (error: any) {
        console.error("AI Stream Error:", error);
        onChunk(`\n\n[Error: ${error.message}]`);
    }
};
