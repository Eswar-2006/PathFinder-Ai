<div align="center">
  <img width="1200" height="475" alt="PathFinder AI Banner" src="./public/banner.png" />
  <h1>🚀 PathFinder AI</h1>
  <p><strong>A Strategic Career Architect and Mentor Powered by Advanced AI</strong></p>
</div>

---

## 📖 Overview

**PathFinder AI** is a world-class AI-driven career mentoring platform. Built to guide students, professionals, and aspirants towards high-impact, stable, and rewarding careers, it provides personalized advice across diverse domains—ranging from emerging technologies (AI, Web3, Data Science) to traditional and government sectors (UPSC, Defense, Banking).

Using state-of-the-art Large Language Models (LLMs) and Vision capabilities, PathFinder AI doesn't just give generic advice; it acts as an intelligent companion that can analyze documents, generate visual roadmaps, and adapt to your preferred language (including Hinglish) to chart out the best path forward.

---

## ✨ Key Features

- **🎯 Personalized Career Mentorship**: Get strategic advice tailored to your goals, whether you're targeting Defense (NDA, CDS), Government exams (UPSC, SSC), or the Tech industry.
- **👁️ AI Vision Capabilities**: Upload images (like scorecards, certificates, or career charts). PathFinder uses the **Hugging Face Inference API (Qwen-VL)** to analyze them and provide context-aware guidance.
- **🗺️ Visual Roadmaps (Mermaid.js)**: Automatically generates beautiful, interactive flowcharts and roadmaps to visualize your career trajectory.
- **🗣️ Multilingual Support**: Communicates natively in English, Hinglish, and other regional languages to ensure the advice is accessible and conversational.
- **⚡ Multiple AI Providers**: Seamlessly switch between **Google Gemini (1.5 Flash)** and **Groq (Llama-3.3-70b)** for lightning-fast inference.
- **✨ Beautiful UI/UX**: Built with **React**, **Tailwind CSS**, and animated with **Framer Motion** for a sleek, responsive, and engaging user experience.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Tailwind Typography, Lucide React (Icons)
- **Animations**: Framer Motion
- **AI & Integrations**: 
  - `@google/generative-ai` (Gemini API)
  - `groq-sdk` (Llama Models)
  - `@huggingface/inference` (Vision processing)
- **Markdown Rendering**: `react-markdown`, `remark-gfm`

---

## 🚀 Getting Started

Follow these instructions to set up PathFinder AI locally on your machine.

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Eswar-2006/PathFinder-Ai.git
   cd PathFinder-Ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root of the project and add your API keys:
   ```env
   # Primary LLM API Key (Google Gemini or Groq)
   VITE_GEMINI_API_KEY=your_gemini_or_groq_api_key_here

   # Hugging Face Vision API Key (Optional but recommended for image analysis)
   VITE_HF_TOKEN=your_huggingface_token_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to `http://localhost:5173` to explore your AI Mentor!

---

## 🧠 How the AI Works

PathFinder AI utilizes a robust **System Prompt** designed specifically for career architecture. 
- **Context-Aware Routing**: Based on the user's uploaded images or text inputs, it routes the query to the best available model.
- **Vision Parsing**: Images are first passed through Hugging Face's `Qwen/Qwen2.5-VL-72B-Instruct` model to extract text and context, which is then fed into the conversational LLM.
- **Roadmap Generation**: The LLM is instructed to output standard `mermaid` markdown syntax when a user asks for a plan, which the frontend automatically renders into interactive diagrams.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Eswar-2006/PathFinder-Ai/issues).

---

<div align="center">
  <i>Empowering the next generation with data-driven career strategies.</i>
</div>
