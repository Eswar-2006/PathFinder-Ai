import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const SYSTEM_INSTRUCTION = `
You are PathFinder AI, a world-class Strategic Career Architect and Mentor.
Your expertise spans Emerging Technologies (AI, Robotics, Cybersecurity) AND Traditional/Government Sectors (UPSC, Defense - Army/Navy/Air Force, Banking, SSC).

Your goal is to guide students from India and globally towards high-impact, stable, and rewarding careers.

═══════════════════════════════════════
CONVERSATION CONSISTENCY & FOCUS RULES
═══════════════════════════════════════

1. **CONVERSATION MEMORY**: You MUST maintain full context of the ongoing conversation.
   - Remember every detail the user has shared: their name, education level, interests, goals, preferred career path, exam targets, scores, etc.
   - Reference their previously stated information naturally in your responses.
   - NEVER ask for information the user has already provided in the current conversation.

2. **FLEXIBLE YET FOCUSED**: You are a friendly, conversational AI. You can chat casually with the user about various topics, but your primary purpose is career and education mentorship.
   - If the user asks a general question, answer it naturally and warmly.
   - After answering, gently steer the conversation back to their career journey.
   - Be a supportive friend and mentor.

3. **FLOW CONTINUITY**: Every response should feel like a natural continuation of the conversation.
   - Acknowledge what the user just said before providing new information.
   - Connect new advice to their previously stated goals and context.

4. Operational Guidelines:
   - For Tech: Focus on AI, Web3, Data Science.
   - For Govt/Defense: Focus on exams (NDA, CDS, AFCAT, UPSC, SSC), physical eligibility, and strategic preparation.
   - Stream & Degree advice tailored to Indian & global contexts.
   - Professional, encouraging, data-driven tone.
   - ALWAYS end your response with "**Your Next Move**" proposing the next actionable step.
   - When asked for a Roadmap/Flowchart/Plan, include a \`\`\`mermaid diagram block.
`;

const getClientApiKey = () => {
    return (
        (import.meta as any).env?.VITE_GEMINI_API_KEY ||
        (import.meta as any).env?.VITE_GROQ_API_KEY ||
        (process as any).env?.GEMINI_API_KEY ||
        (process as any).env?.API_KEY ||
        ""
    );
};

const getLanguagePrompt = (language: string) => {
    if (language === 'Hinglish') {
        return "\n\nIMPORTANT: Respond in Hinglish (Hindi written in English script), casual and conversational like a mentor speaking to an Indian student.";
    } else if (language && language !== 'English') {
        return `\n\nIMPORTANT: Respond in ${language}. Answer formally and accurately in the ${language} script (if applicable).`;
    }
    return "\n\nIMPORTANT: Respond in professional English.";
};

// Direct client fallback
const directClientStream = async (
    prompt: string,
    history: { role: 'user' | 'model', parts: { text: string }[] }[],
    onChunk: (text: string) => void,
    imageData?: string,
    language: string = 'English'
) => {
    const apiKey = getClientApiKey();
    if (!apiKey) {
        throw new Error("No API key configured. Please set GEMINI_API_KEY in your Netlify site settings or .env.local file.");
    }

    const finalSystemInstruction = SYSTEM_INSTRUCTION + getLanguagePrompt(language);

    if (apiKey.startsWith('gsk_')) {
        const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
        const messages = [
            { role: "system", content: finalSystemInstruction },
            ...(history || []).map((h: any) => ({
                role: h.role === 'model' ? 'assistant' : 'user',
                content: h.parts[0].text
            })),
            { role: "user", content: prompt }
        ];

        let targetModel = 'llama-3.1-8b-instant';
        try {
            const list = await groq.models.list();
            const activeModels = (list.data || []).map((m: any) => m.id);
            const preferred = activeModels.find((id: string) => 
                !id.includes('whisper') && !id.includes('guard') && (
                    id.includes('llama-3.3-70b') ||
                    id.includes('llama-3.1-70b') ||
                    id.includes('llama-3.1-8b') ||
                    id.includes('llama3') ||
                    id.includes('qwen') ||
                    id.includes('gemma') ||
                    id.includes('deepseek')
                )
            );
            if (preferred) {
                targetModel = preferred;
            } else if (activeModels.length > 0) {
                const textModel = activeModels.find((id: string) => !id.includes('whisper') && !id.includes('guard'));
                if (textModel) targetModel = textModel;
            }
        } catch (e) {
            console.warn("Could not query Groq models dynamically on client:", e);
        }

        const completion = await groq.chat.completions.create({
            messages: messages as any,
            model: targetModel,
            temperature: 0.7,
            stream: true,
        });

        for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                onChunk(content);
            }
        }
    } else {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: finalSystemInstruction
        });

        const currentMessageParts: any[] = [];
        if (imageData) {
            const base64Data = imageData.split(',')[1];
            if (base64Data) {
                currentMessageParts.push({ inlineData: { data: base64Data, mimeType: 'image/jpeg' } });
            }
        }
        currentMessageParts.push({ text: prompt.trim() || (imageData ? "Analyze this image" : "Hello") });

        const contents = [
            ...(history || []).map((h: any) => ({ role: h.role, parts: h.parts })),
            { role: 'user', parts: currentMessageParts }
        ];

        const result = await model.generateContentStream({ contents });
        for await (const chunk of result.stream) {
            onChunk(chunk.text());
        }
    }
};

export const getGeminiResponse = async (
    prompt: string, 
    history: { role: 'user' | 'model', parts: { text: string }[] }[], 
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
                isStream: false
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.text;
        }
        throw new Error(`Server returned ${response.status}`);
    } catch (serverError: any) {
        console.warn("Netlify function call failed, attempting client fallback:", serverError);
        let accumulated = "";
        try {
            await directClientStream(prompt, history, (chunk) => { accumulated += chunk; }, imageData, language);
            return accumulated;
        } catch (clientError: any) {
            console.error("AI API Error:", clientError);
            return `Error: ${clientError.message || "Failed to connect to AI service."}`;
        }
    }
};

export const getGeminiStream = async (
    prompt: string,
    history: { role: 'user' | 'model', parts: { text: string }[] }[],
    onChunk: (text: string) => void,
    imageData?: string,
    language: string = 'English'
) => {
    let succeeded = false;
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

        if (response.ok && response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                if (chunk) {
                    onChunk(chunk);
                    succeeded = true;
                }
            }
            return;
        }
        throw new Error(`Server returned status: ${response.status}`);
    } catch (serverError: any) {
        console.warn("Netlify function stream failed, attempting client fallback:", serverError);
        if (!succeeded) {
            try {
                await directClientStream(prompt, history, onChunk, imageData, language);
            } catch (fallbackError: any) {
                console.error("AI Stream Fallback Error:", fallbackError);
                onChunk(`\n\n[Error: ${fallbackError.message || "Could not connect to AI service"}]`);
            }
        }
    }
};
