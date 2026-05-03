import { stream } from "@netlify/functions";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const SYSTEM_INSTRUCTION = `
You are PathFinder AI, a world-class Strategic Career Architect and Mentor.
Your expertise spans Emerging Technologies (AI, Robotics, Cybersecurity) AND Traditional/Government Sectors (UPSC, Defense - Army/Navy/Air Force, Banking, SSC).

Your goal is to guide students from India and globally towards high-impact, stable, and rewarding careers.

═══════════════════════════════════════
CONVERSATION CONSISTENCY & FOCUS RULES
═══════════════════════════════════════

9. **CONVERSATION MEMORY**: You MUST maintain full context of the ongoing conversation.
   - Remember every detail the user has shared: their name, education level, interests, goals, preferred career path, exam targets, scores, etc.
   - Reference their previously stated information naturally in your responses (e.g., "Since you mentioned you're in 12th Science with PCM..." or "Building on your interest in cybersecurity that we discussed...").
   - NEVER ask for information the user has already provided in the current conversation.

10. **FLEXIBLE YET FOCUSED**: You are a friendly, conversational AI. You can chat casually with the user about various topics, but your primary purpose is career and education mentorship.
   - If the user asks a general question (e.g., "how are you?", "tell me a joke", or general knowledge), answer it naturally and warmly.
   - After answering, gently steer the conversation back to their career journey. For example: "By the way, how is your preparation for [Exam] going?" or "Speaking of problem-solving, have you thought about what skills you want to learn next?"
   - Be a supportive friend and mentor, but don't lose sight of the ultimate goal: guiding them to a successful career.

11. **FLOW CONTINUITY**: Every response should feel like a natural continuation of the conversation.
   - Acknowledge what the user just said before providing new information.
   - Connect new advice to their previously stated goals and context.
   - If the user changes their career interest mid-conversation, acknowledge the shift: "I see you're now interested in [new topic] — that's a great pivot! Let me adjust our roadmap..."

Operational Guidelines:
1. PREFERENCE-DRIVEN: Always respect the user's choice between Tech, Non-Tech, Government, or Defense paths.
2. DIVERSE DOMAINS:
   - For Tech: Focus on AI, Web3, Data Science.
   - For Govt/Defense: Focus on exams (NDA, CDS, AFCAT, UPSC, SSC), physical eligibility, and strategic preparation.
3. POST-MATRICULATION (10th): Focus on stream selection (Science/Commerce/Arts) relevant to their goal (e.g., PCM for Air Force/Navy).
4. POST-INTERMEDIATE (12th): Prioritize relevant degrees (B.Tech, B.A., B.Sc) or direct entry exams (NDA).
5. TONE: Professional, patriotic (for defense), encouraging, data-driven. Mention salary/ranks.
6. FORMATTING: Use markdown with bullet points for readability.
7. **CRITICAL - END OF RESPONSE**: ALWAYS end your response with a section called "**Your Next Move**" where you:
   - Ask a specific, relevant follow-up question to narrow down their path.
   - Suggest the next logical step they should take (e.g., "Would you like me to create a 6-month study plan for NDA?" or "Should we explore the syllabus for JEE Mains?").
   - This makes it easier for the user to map their goals.
8. **VISUAL ROADMAPS**: If the user asks for a "Roadmap", "Flowchart", or "Plan", ALWAYS include a Mermaid.js diagram code block.
   - Use \`mermaid\` syntax.
   - Wrap it in a code block like:
     \`\`\`mermaid
     graph TD;
     A[Start] --> B[Step 1];
     \`\`\`
   - Keep it simple and hierarchical.
`;

export const handler = stream(async (event) => {
    if (event.httpMethod !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const { prompt, history, imageData, language, isStream } = JSON.parse(event.body || "{}");
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        return new Response("Configuration Error: API Key is missing.", { status: 500 });
    }

    const isGroq = apiKey.startsWith('gsk_');

    let languageInstruction = "";
    if (language === 'Hinglish') {
        languageInstruction = "\n\nIMPORTANT: Respond in Hinglish (Hindi written in English script), casual and conversational like a mentor speaking to an Indian student.";
    } else if (language !== 'English') {
        languageInstruction = `\n\nIMPORTANT: Respond in ${language}. Answer formally and accurately in the ${language} script (if applicable).`;
    } else {
        languageInstruction = "\n\nIMPORTANT: Respond in professional English.";
    }

    const finalSystemInstruction = SYSTEM_INSTRUCTION + languageInstruction;

    if (isGroq) {
        if (imageData) {
            return new Response("System Info: Groq does not support direct image analysis.", { status: 400 });
        }

        const groq = new Groq({ apiKey });

        const messages = [
            { role: "system", content: finalSystemInstruction },
            ...(history || []).map((h: any) => ({
                role: h.role === 'model' ? 'assistant' : 'user',
                content: h.parts[0].text
            })),
            { role: "user", content: prompt }
        ];

        const modelName = 'llama-3.3-70b-versatile';

        if (isStream) {
            const completion = await groq.chat.completions.create({
                messages: messages as any,
                model: modelName,
                temperature: 0.7,
                stream: true,
            });

            const readableStream = new ReadableStream({
                async start(controller) {
                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(new TextEncoder().encode(content));
                        }
                    }
                    controller.close();
                }
            });

            return new Response(readableStream, {
                headers: { "Content-Type": "text/event-stream" }
            });
        } else {
            const completion = await groq.chat.completions.create({
                messages: messages as any,
                model: modelName,
                temperature: 0.7,
            });
            return new Response(JSON.stringify({ text: completion.choices[0]?.message?.content || "No response" }), {
                headers: { "Content-Type": "application/json" }
            });
        }

    } else {
        // Gemini
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

        if (isStream) {
            const result = await model.generateContentStream({ contents });
            const readableStream = new ReadableStream({
                async start(controller) {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        controller.enqueue(new TextEncoder().encode(chunkText));
                    }
                    controller.close();
                }
            });

            return new Response(readableStream, {
                headers: { "Content-Type": "text/event-stream" }
            });
        } else {
            const result = await model.generateContent({ contents });
            const response = await result.response;
            return new Response(JSON.stringify({ text: response.text() }), {
                headers: { "Content-Type": "application/json" }
            });
        }
    }
});
