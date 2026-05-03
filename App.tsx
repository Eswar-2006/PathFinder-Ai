
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  MicOff,
  History,
  Menu,
  X,
  GraduationCap,
  Trophy,
  TrendingUp,
  Camera,
  Plus,
  PanelLeft,
  PanelRight,
  Trash2,
  EyeOff,
  Volume2,
  VolumeX,
  Languages,
  Bot
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sender, Message, HistoryItem, HistoryCategory, Scholarship } from './types.ts';
import { getGeminiResponse, getGeminiStream } from './services/gemini.ts';
import { analyzeImageHF } from './services/huggingface.ts';
import { NIRF_DATA, NirfUniversity } from './src/data/nirfData.ts';
import CareerQuiz from './src/components/CareerQuiz.tsx';
import MermaidChart from './src/components/MermaidChart.tsx';
const NIRF_CONTEXT_STRING = NIRF_DATA.map(u =>
  `#${u.rank} ${u.name} (${u.location}) - Type: ${u.type}`
).join('\n');

const MOCK_SCHOLARSHIPS = [
  {
    id: '1',
    name: 'Reliance Foundation',
    provider: 'Reliance',
    amount: '₹2,00,000',
    status: 'Open' as const,
    deadline: 'Oct 15, 2026',
    uptime: '99.9%',
    category: 'Most Applied'
  },
  {
    id: '2',
    name: 'HDFC Badhte Kadam',
    provider: 'HDFC Bank',
    amount: '₹1,00,000',
    status: 'Open' as const,
    deadline: 'Nov 10, 2026',
    uptime: '99.9%',
    category: 'Most Applied'
  },
  {
    id: '3',
    name: 'Tata Capital Pankh',
    provider: 'Tata Capital',
    amount: 'Up to 80%',
    status: 'Closing Soon' as const,
    deadline: 'Sep 30, 2026',
    uptime: '99.7%',
    category: 'All Eligible'
  },
];

const MOCK_UNIVERSITIES = [
  {
    id: '1',
    name: 'IIT Delhi',
    location: 'New Delhi',
    avgPackage: '₹22 LPA',
    admissionStatus: 'Open',
    nextIntake: 'Jul 2026',
    uptime: '100%'
  },
  {
    id: '2',
    name: 'BITS Pilani',
    location: 'Rajasthan',
    avgPackage: '₹18 LPA',
    admissionStatus: 'Closed',
    nextIntake: 'Jan 2027',
    uptime: '99.8%'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const popVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
};

const QUICK_CHIPS = [
  "AI Roadmap",
  "Cybersecurity Path",
  "Take Career Quiz",
  "Robotics Courses"
];

const CAREER_PROMPTS = [
  "Plan my roadmap to becoming a Data Scientist...",
  "Find scholarships for Masters in Computer Science...",
  "What are the highest paying tech jobs in 2026?...",
  "How to crack Google & Microsoft interviews?...",
  "Suggest certification courses for Cloud Computing...",
  "List top universities for Artificial Intelligence..."
];

const AnimatedRobot = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="relative z-10 bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-full shadow-2xl shadow-blue-500/40 border border-white/20">
        <div className="bg-black/80 rounded-full p-4 backdrop-blur-sm">
          <div className="relative">
            <Bot size={64} className="text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
            <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <motion.div
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              className="absolute top-[22px] left-[18px] w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]"
            />
            <motion.div
              animate={{ scaleY: [1, 0.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, delay: 0.1 }}
              className="absolute top-[22px] right-[18px] w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]"
            />
          </div>
        </div>
      </div>
      {/* Speech Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 50 }}
        transition={{ delay: 1 }}
        className="absolute -right-16 top-0 bg-white text-blue-900 text-[10px] font-bold px-3 py-1.5 rounded-xl rounded-bl-sm shadow-lg whitespace-nowrap"
      >
        I'm PathFinder! 🤖
      </motion.div>
    </motion.div>
  );
};

const MOTIVATIONAL_LINES = [
  "Your AI Career Copilot",
  "Guidance You Can Trust",
  "Building India's Future Leaders",
  "From Confusion to Clarity",
  "Your Success is Our Mission",
  "Data-Driven. Dream-Oriented."
];

const cleanTextForTTS = (markdown: string) => {
  if (!markdown) return '';
  return markdown
    // Remove headers (# Header)
    .replace(/^#+\s/gm, '')
    // Remove bold/italic (**text**, *text*, __text__, _text_)
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove unordered list bullets (* Item, - Item)
    .replace(/^[\*\-]\s/gm, '')
    // Remove links ([text](url)) -> text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove images (![alt](url)) -> nothing
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
    // Remove blockquotes (> text)
    .replace(/^>\s/gm, '')
    // Remove code blocks (```code```) -> code (stripped of ticks)
    .replace(/```/g, '')
    // Remove inline code (`code`)
    .replace(/`/g, '')
    // Remove generic markdown symbols that might be read out
    .replace(/[*#]/g, '')
    // Collapse multiple spaces/newlines
    .replace(/\s+/g, ' ')
    .trim();
};

const App: React.FC = () => {
  // Expanded Language Support
  const LANGUAGES = [
    { name: 'English', code: 'en-US' },
    { name: 'Hindi', code: 'hi-IN' },
    { name: 'Hinglish', code: 'hi-IN' },
    { name: 'Bengali', code: 'bn-IN' },
    { name: 'Telugu', code: 'te-IN' },
    { name: 'Marathi', code: 'mr-IN' },
    { name: 'Tamil', code: 'ta-IN' },
    { name: 'Urdu', code: 'ur-IN' },
    { name: 'Gujarati', code: 'gu-IN' },
    { name: 'Kannada', code: 'kn-IN' },
    { name: 'Malayalam', code: 'ml-IN' },
    { name: 'Punjabi', code: 'pa-IN' },
    { name: 'Odia', code: 'or-IN' },
    { name: 'Spanish', code: 'es-ES' },
    { name: 'French', code: 'fr-FR' },
    { name: 'German', code: 'de-DE' }
  ];

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  // Right Sidebar States
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false); // Mobile
  const [isDesktopRightSidebarOpen, setIsDesktopRightSidebarOpen] = useState(false); // Desktop

  const [isTemporaryMode, setIsTemporaryMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);


  const [scholarships, setScholarships] = useState<Scholarship[]>(MOCK_SCHOLARSHIPS);
  const [universities, setUniversities] = useState<NirfUniversity[]>(NIRF_DATA);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const fetchDynamicData = async (type: 'scholarships' | 'universities') => {
    setIsFetchingData(true);
    try {
      const uniPromptContext = uniFilter === 'All'
        ? "100 top ranked engineering colleges in India"
        : `top ${uniFilter} engineering colleges in India (as many as exist, up to 100)`;

      const prompt = type === 'scholarships'
        ? `Generate a JSON array of 5 real scholarships in India for ${new Date().getFullYear()} for engineering/medical students. Fields: id (string), name, provider, amount, status (Open/Closing Soon/Closed), deadline, category (e.g., 'Merit-based'). No markdown, just raw JSON.`
        : `Generate a JSON array of ${uniPromptContext} (NIRF style) for ${new Date().getFullYear()}. Fields: rank (number), name, type (IIT/NIT/Private/Govt/GFTI), location, score (string). No markdown, just raw JSON.`;

      const response = await getGeminiResponse(prompt, [], undefined, 'English');

      // Clean up response to get straight JSON
      const jsonString = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(jsonString);

      if (type === 'scholarships') {
        setScholarships(data);
      } else {
        setUniversities(data);
      }
    } catch (error) {
      console.error("Failed to fetch dynamic data", error);
      alert("Failed to update data from AI. Using cached data.");
    } finally {
      setIsFetchingData(false);
    }
  };

  const [uniFilter, setUniFilter] = useState<'All' | 'IIT' | 'NIT' | 'Private' | 'GFTI' | 'Govt'>('All');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const speakText = (text: string, id: string) => {
    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = cleanTextForTTS(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Improved Voice Matching
    const voices = window.speechSynthesis.getVoices();
    const langConfig = LANGUAGES.find(l => l.name === selectedLanguage);

    let preferredVoice = null;
    if (langConfig) {
      // Exact code match
      preferredVoice = voices.find(v => v.lang === langConfig.code);
      // Fallback to loose match (e.g. 'hi' for 'hi-IN')
      if (!preferredVoice) {
        preferredVoice = voices.find(v => v.lang.includes(langConfig.code.split('-')[0]));
      }
    }

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    } else {
      // Fallback for English if no specific voice found
      if (selectedLanguage === 'English') {
        const enVoice = voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }
    }

    utterance.onend = () => setSpeakingMessageId(null);
    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistoryItems(parsed);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const voiceTextRef = useRef('');

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);

  // Tour State: 1 = Left, 2 = Input, 3 = Right, 0 = Done
  // Default to 0 (Done) to avoid blocking the UI, unless we want to force it.
  // Tour State: 1 = Left, 2 = Input, 3 = Right, 0 = Done
  const [tourStep, setTourStep] = useState(() => {
    const saved = localStorage.getItem('tourCompleted');
    return saved === 'true' ? 0 : 1;
  });

  const endTour = () => {
    setTourStep(0);
    setIsDesktopRightSidebarOpen(false);
    setIsRightSidebarOpen(false);
    localStorage.setItem('tourCompleted', 'true');
  };

  const handleTourNext = () => {
    if (tourStep === 2) {
      // Auto-open Right Sidebar for Step 3
      setIsDesktopRightSidebarOpen(true);
      if (window.innerWidth < 1280) setIsRightSidebarOpen(true);
    }
    setTourStep(prev => prev + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % CAREER_PROMPTS.length);
      setHeroIndex((prev) => (prev + 1) % MOTIVATIONAL_LINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Force Left Sidebar open for Step 1
    if (tourStep === 1) setIsDesktopSidebarOpen(true);
  }, [tourStep]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);

      // Create a small user notification
      const userMsg: Message = {
        id: Date.now().toString(),
        sender: Sender.USER,
        text: "📷 Image uploaded for recognition.",
        timestamp: new Date(),
        isImage: true
      };
      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);
      setIsAnalyzingImage(true);

      try {
        // Use Hugging Face for initial quick recognition (if configured)
        const hfRecognition = await analyzeImageHF(base64);
        
        const aiMsgId = (Date.now() + 1).toString();
        setStreamingMsgId(aiMsgId);
        // Always show Analyzing immediately
        setMessages(prev => [...prev, {
          id: aiMsgId,
          sender: Sender.AI,
          text: "🔍 Analyzing image and determining relevance...",
          timestamp: new Date()
        }]);

        if (hfRecognition) {
          const prompt = `I just uploaded an image, and a computer vision model described it as: "${hfRecognition}". \n\nFirst, determine if this description is structurally relevant to career planning, education, academics, documents (like certificates, report cards, mark sheets, resumes), or professional skills. \nIf it IS relevant, tell me what you see based on the description and provide specific career/education suggestions and guidance based on the content. Ask: 'What would you like me to do with this image?'. \nIf it is NOT relevant at all to career or education, respond EXACTLY like this: "📋 I couldn't find any career or education-related content in this image. Here's what I can help with instead:\n\n🎯 **Take the Career Quiz** — Answer a few quick questions and I'll chart your ideal path.\n✍️ **Tell me manually** — Share your current education level, interests, and goals and I'll guide you.\n📷 **Upload a relevant document** — Try uploading a report card, certificate, resume, or any academic document.\n\nHow would you like to proceed?"`;
          
          let fullResponse = "";
          await getGeminiStream(
            prompt,
            [],
            (chunk) => {
              fullResponse += chunk;
              setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullResponse } : m));
            },
            undefined, // No image passed, pure text inference
            selectedLanguage
          );
        } else {
          // If HF totally fails, fallback to Gemini Vision API
          const autoPrompt = "Analyze this image. First, determine if it is relevant to career planning, education, academics, documents (like certificates, report cards, mark sheets, resumes), or professional skills. If it IS relevant, tell me what you see and provide specific career/education suggestions and guidance based on the content. Ask: 'What would you like me to do with this image?'. If it is NOT relevant at all to career or education, respond EXACTLY like this: '📋 I couldn\'t find any career or education-related content in this image. Here\'s what I can help with instead:\n\n🎯 **Take the Career Quiz** — Answer a few quick questions and I\'ll chart your ideal path.\n✍️ **Tell me manually** — Share your current education level, interests, and goals and I\'ll guide you.\n📷 **Upload a relevant document** — Try uploading a report card, certificate, resume, or any academic document.\n\nHow would you like to proceed?'";
          
          let fullResponse = "";
          await getGeminiStream(
            autoPrompt,
            [],
            (chunk) => {
              fullResponse += chunk;
              setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullResponse } : m));
            },
            base64,
            selectedLanguage
          );
        }
      } catch (err) {
        console.error("Analysis Error:", err);
      } finally {
        setStreamingMsgId(null);
        setIsLoading(false);
        setIsAnalyzingImage(false);
        // Clear the image preview after analysis is complete.
        // The image has already been analyzed and the AI response is in the chat history.
        // Follow-up messages should be pure text conversations referencing the prior context.
        setImagePreview(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textToUse: string = inputText) => {
    const finalPrompt = textToUse.trim();
    if (!finalPrompt) return;

    // Capture and immediately clear any pending image so it's used only once
    const pendingImage = imagePreview;
    setImagePreview(null);

    // Inject NIRF Context just for the API call (hidden from UI)
    const promptWithContext = `
      [SYSTEM: Use this NIRF 2024 University Ranking Data for reference. If answering about colleges, strictly adhere to these ranks:
      ${NIRF_CONTEXT_STRING}
      ]
      ${finalPrompt}
    `;

    // Create user message object first
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text: finalPrompt || "Attached image",
      timestamp: new Date(),
      isImage: !!imagePreview
    };

    let activeChatId = currentChatId;

    if (messages.length === 0 && !isTemporaryMode) {
      const newChatId = Date.now().toString();
      activeChatId = newChatId;
      setCurrentChatId(newChatId);

      const newItem: HistoryItem = {
        id: newChatId,
        title: finalPrompt.substring(0, 30) || "Image Analysis",
        category: HistoryCategory.CHATS,
        timestamp: new Date(),
        messages: [userMsg]
      };

      setHistoryItems(prev => {
        const newer = [newItem, ...prev];
        localStorage.setItem('chatHistory', JSON.stringify(newer));
        return newer;
      });
    } else if (!isTemporaryMode && activeChatId) {
      // Update existing chat history immediately with user message
      setHistoryItems(prev => {
        const updated = prev.map(item =>
          item.id === activeChatId
            ? { ...item, messages: [...(item.messages || []), userMsg] }
            : item
        );
        localStorage.setItem('chatHistory', JSON.stringify(updated));
        return updated;
      });
    }

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Create placeholder AI message
    const aiMsgId = (Date.now() + 1).toString();
    const aiMsgPlaceholder: Message = {
      id: aiMsgId,
      sender: Sender.AI,
      text: '', // Start empty
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsgPlaceholder]);
    setStreamingMsgId(aiMsgId);
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.sender === Sender.USER ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }]
      }));

      // Optimizing React Rendering During Stream
      let fullResponse = "";
      let lastRenderTime = 0;
      const RENDER_INTERVAL = 80; // ms between React state updates

      await getGeminiStream(
        finalPrompt,
        chatHistory,
        (chunk) => {
          fullResponse += chunk;

          // Throttle React state updates to prevent layout thrashing
          const now = Date.now();
          if (now - lastRenderTime < RENDER_INTERVAL) return;
          lastRenderTime = now;
          setMessages(prev => prev.map(m =>
            m.id === aiMsgId ? { ...m, text: fullResponse } : m
          ));
        },
        pendingImage || undefined,
        selectedLanguage
      );

      // Force final update and switch to markdown rendering
      setStreamingMsgId(null);
      setMessages(prev => prev.map(m =>
        m.id === aiMsgId ? { ...m, text: fullResponse } : m
      ));

      // Final update to history after stream is done
      if (!isTemporaryMode && activeChatId && fullResponse) {
        setHistoryItems(history => {
          const updated = history.map(item =>
            item.id === activeChatId
              ? { ...item, messages: [...(item.messages || []), userMsg, { ...aiMsgPlaceholder, text: fullResponse }] }
              : item
          );
          localStorage.setItem('chatHistory', JSON.stringify(updated));
          return updated;
        });
      }

      // imagePreview already cleared at the top of handleSendMessage
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = (item: HistoryItem) => {
    setMessages(item.messages || []);
    setCurrentChatId(item.id);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Set language based on selection
    const langConfig = LANGUAGES.find(l => l.name === selectedLanguage);
    recognition.lang = langConfig ? langConfig.code : 'en-US';

    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Reset voice accumulator
    voiceTextRef.current = '';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      voiceTextRef.current += (voiceTextRef.current ? " " : "") + transcript;
      setInputText(prev => prev + (prev ? " " : "") + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-send if we have text
      if (voiceTextRef.current.trim()) {
        handleSendMessage(voiceTextRef.current);
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
    }
  };

  return (
    <div className="flex h-screen w-full text-white overflow-hidden relative font-['Inter']">

      {/* Tour Spotlight Overlay */}
      <AnimatePresence>
        {tourStep > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <CareerQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSubmit={(prompt) => handleSendMessage(prompt)}
      />

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed lg:relative z-[60] h-full glass transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isDesktopSidebarOpen ? 'w-72 md:w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden lg:translate-x-0'}
      `}>
        {/* Step 1: Tour Tooltip */}

        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp size={22} />
              </div>
              <h1 className="text-xl font-bold tracking-tight">PathFinder</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-white/60">
              <X size={24} />
            </button>
          </div>

          <button
            onClick={() => { setMessages([]); setInputText(''); setIsSidebarOpen(false); setCurrentChatId(null); }}
            className={`w-full mb-3 py-4 px-6 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all border
              ${isTemporaryMode
                ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 hover:bg-amber-500/20'
                : 'bg-white/10 hover:bg-white/20 border-white/10'
              }`}
          >
            {isTemporaryMode ? <EyeOff size={20} /> : <Plus size={20} />}
            {isTemporaryMode ? 'Temporary Chat' : 'New Chat'}
          </button>

          <button
            onClick={() => setIsTemporaryMode(!isTemporaryMode)}
            className={`w-full mb-8 py-2 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all
              ${isTemporaryMode ? 'text-amber-500 bg-amber-500/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            {isTemporaryMode ? 'Disable Temp Mode' : 'Enable Temp Mode'}
          </button>

          <div className="mb-8">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Languages size={12} /> Language
            </div>

            {/* Top 3 Quick Select */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              {LANGUAGES.slice(0, 3).map(lang => (
                <button
                  key={lang.name}
                  onClick={() => setSelectedLanguage(lang.name)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all border ${selectedLanguage === lang.name
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-200'
                    : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'
                    }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            {/* Dropdown for others */}
            <select
              value={LANGUAGES.some(l => l.name === selectedLanguage) && !['English', 'Hindi', 'Hinglish'].includes(selectedLanguage) ? selectedLanguage : ''}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white/70 focus:outline-none focus:border-blue-500/50 focus:bg-white/10"
            >
              <option value="" disabled>More Languages...</option>
              {LANGUAGES.slice(3).map(lang => (
                <option key={lang.name} value={lang.name} className="bg-[#0f172a] text-white">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <motion.div
            className="flex-1 overflow-y-auto no-scrollbar"
            variants={containerVariants}
            initial="hidden"
            animate={tourStep === 0 || tourStep === 1 || isSidebarOpen ? "visible" : "hidden"}
          >
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <History size={12} /> Recent
            </div>
            <div className="space-y-2">
              {historyItems.map(item => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="group flex items-center gap-2 relative"
                >
                  <button
                    onClick={() => loadChat(item)}
                    className="flex-1 text-left p-3.5 rounded-xl glass-dark hover:bg-white/10 transition-all flex items-center gap-3 truncate border border-white/5">
                    <span className="text-sm opacity-80 truncate">{item.title}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHistoryItems(prev => prev.filter(i => i.id !== item.id));
                    }}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all absolute right-2"
                    title="Delete Chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
              {historyItems.length === 0 && <p className="text-xs text-white/30 italic px-4">No recent chats</p>}
            </div>
          </motion.div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative h-full">
        {/* Toggle Button for Right Sidebar (Explore) */}
        <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
          <AnimatePresence>
            {(!isDesktopRightSidebarOpen && !isRightSidebarOpen) && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/20 mr-2"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Explore Scholarships</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => {
              if (window.innerWidth >= 1280) { // xl breakpoint
                setIsDesktopRightSidebarOpen(!isDesktopRightSidebarOpen);
              } else {
                setIsRightSidebarOpen(true);
              }
            }}
            className="p-3 glass rounded-2xl hover:bg-white/10 transition-colors relative group"
            title="Explore Panel"
          >
            <PanelRight size={24} />
            {(!isDesktopRightSidebarOpen && !isRightSidebarOpen) && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#1a1f35]"></span>
            )}
          </button>
        </div>

        <div className="absolute top-6 left-6 z-50 flex items-center gap-2">
          <button onClick={() => setIsSidebarOpen(true)} className="p-3 glass rounded-2xl lg:hidden">
            <Menu size={24} />
          </button>
          <button
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            className="hidden lg:flex p-3 glass rounded-2xl hover:bg-white/10 transition-colors"
            title="Toggle Sidebar"
          >
            <PanelLeft size={24} />
          </button>
        </div>


        {/* Step 1: Tour Tooltip (Left Side of Main) */}
        <AnimatePresence>
          {tourStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-24 left-4 md:left-6 z-[80] p-5 glass-dark border-[1.5px] border-blue-500/50 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.2)] w-[calc(100vw-2rem)] max-w-[20rem] md:w-[22rem] md:max-w-none backdrop-blur-xl"
            >
              <div className="flex items-start gap-4">
                <div className="relative p-3 bg-blue-500 rounded-xl shrink-0 shadow-lg">
                  <div className="absolute inset-0 bg-blue-400 rounded-xl animate-ping opacity-20"></div>
                  <History size={20} className="text-white relative z-10" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-base text-blue-100">Your History</h4>
                    <span className="text-[10px] font-bold tracking-wider text-blue-300/60 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">Step 1 of 3</span>
                  </div>
                  <p className="text-sm text-blue-200/80 mb-4 leading-relaxed">
                    Access your past chats, career roadmaps, and saved searches right here anytime.
                  </p>
                  <div className="flex items-center gap-3">
                    <button onClick={endTour} className="text-xs font-medium text-blue-200/50 hover:text-white transition-colors">
                      Skip Tour
                    </button>
                    <button onClick={handleTourNext} className="text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all flex-1 shadow-lg shadow-blue-500/20 active:scale-95">
                      Next Step →
                    </button>
                  </div>
                </div>
              </div>
              {/* Arrow pointing Left */}
              <div className="absolute -left-2 top-8 w-4 h-4 bg-[#1a1f35] border-t border-l border-blue-500/30 -rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Tour Tooltip (Right Side of Main) */}
        <AnimatePresence>
          {tourStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-24 right-4 md:right-6 z-[80] p-5 glass-dark border-[1.5px] border-blue-500/50 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.2)] w-[calc(100vw-2rem)] max-w-[20rem] md:w-[22rem] md:max-w-none backdrop-blur-xl"
            >
              <div className="flex items-start gap-4">
                <div className="relative p-3 bg-blue-500 rounded-xl shrink-0 shadow-lg">
                  <div className="absolute inset-0 bg-blue-400 rounded-xl animate-ping opacity-20"></div>
                  <Trophy size={20} className="text-white relative z-10" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-base text-blue-100">Explore Panel</h4>
                    <span className="text-[10px] font-bold tracking-wider text-green-300/80 bg-green-500/10 px-2 py-0.5 rounded-full uppercase">Final Step</span>
                  </div>
                  <p className="text-sm text-blue-200/80 mb-4 leading-relaxed">
                    Browse curated scholarships and top university rankings tailored to your goals.
                  </p>
                  <button onClick={endTour} className="text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-green-500/20 active:scale-95 w-full flex justify-center items-center gap-2">
                    Start Exploring ✨
                  </button>
                </div>
              </div>
              {/* Arrow pointing Right */}
              <div className="absolute -right-2 top-8 w-4 h-4 bg-[#1a1f35] border-t border-r border-blue-500/30 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 sm:px-6 md:px-12 pt-24 lg:pt-16 pb-40 lg:pb-32">
          <div className="max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-12 text-center"
                >
                  <div className="flex flex-col items-center">
                    <AnimatedRobot />
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent pb-2 px-2">
                      Unlock Your Potential
                    </h2>
                    <div className="h-12 md:h-16 relative overflow-hidden w-full flex justify-center items-center">
                      <AnimatePresence mode="wait">
                        <motion.h2
                          key={heroIndex}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="text-2xl sm:text-3xl md:text-5xl font-bold text-white/40 tracking-tight absolute text-center w-full px-4"
                        >
                          {MOTIVATIONAL_LINES[heroIndex]}
                        </motion.h2>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => handleSendMessage("Plan my career in AI")} className="text-left glass p-6 rounded-[28px] hover:bg-white/10 transition-all border border-white/10 group">
                      <p className="text-lg font-medium opacity-80 group-hover:opacity-100">Plan my career in AI and Robotics</p>
                    </button>
                    <button onClick={() => handleSendMessage("Top scholarships for 2026")} className="text-left glass p-6 rounded-[28px] hover:bg-white/10 transition-all border border-white/10 group">
                      <p className="text-lg font-medium opacity-80 group-hover:opacity-100">Find top tech scholarships for 2026</p>
                    </button>
                  </div>

                  <motion.div
                    className="flex flex-wrap justify-center gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {QUICK_CHIPS.map(chip => (
                      <motion.button
                        key={chip}
                        variants={popVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (chip === "Take Career Quiz") {
                            setIsQuizOpen(true);
                          } else {
                            handleSendMessage(chip);
                          }
                        }}
                        className={`px-5 py-2.5 rounded-full glass hover:bg-white/10 transition-all text-xs font-semibold border border-white/10 
                          ${chip === 'Take Career Quiz' ? 'relative bg-gradient-to-r from-blue-500/40 to-purple-500/40 border-purple-400 overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:animate-shimmer' : ''}`}
                      >
                        {chip}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                <div className="space-y-8 py-4">
                  {messages.map((msg) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      key={msg.id}
                      className={`flex ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`p-4 md:p-5 rounded-3xl max-w-[95%] md:max-w-[80%] relative group/msg ${msg.sender === Sender.USER
                        ? 'bg-purple-600 shadow-xl text-white'
                        : 'glass-dark border border-white/10 text-gray-100'
                        }`}>
                        {msg.sender === Sender.AI && (
                          <button
                            onClick={() => speakText(msg.text, msg.id)}
                            className="absolute -left-8 md:-left-10 top-2 p-1.5 md:p-2 text-white/40 hover:text-white transition-colors opacity-0 group-hover/msg:opacity-100"
                            title="Read Aloud"
                          >
                            {speakingMessageId === msg.id ? <VolumeX size={16} /> : <Volume2 size={16} />}
                          </button>
                        )}
                        {msg.sender === Sender.USER ? (
                          <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</p>
                        ) : streamingMsgId === msg.id ? (
                          /* During streaming: render as smooth plain text to avoid ReactMarkdown re-parse jank */
                          <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base text-gray-100 transition-none">{msg.text}<span className="inline-block w-1.5 h-4 ml-0.5 bg-purple-400 rounded-sm animate-pulse align-middle" /></p>
                        ) : (
                          <div className="prose prose-invert prose-sm md:prose-base max-w-none 
                                     prose-p:leading-relaxed prose-pre:bg-black/30 prose-pre:p-4 prose-pre:rounded-xl
                                     prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                                     prose-headings:text-white prose-strong:text-white/90">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ node, inline, className, children, ...props }: any) {
                                  const match = /language-(\w+)/.exec(className || '')
                                  const isMermaid = match && match[1] === 'mermaid';

                                  if (!inline && isMermaid) {
                                    return <MermaidChart chart={String(children).replace(/\n$/, '')} />;
                                  }

                                  return !inline && match ? (
                                    <div className="relative">
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </div>
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  )
                                }
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                  }
                  {isLoading && (
                    <div className="flex justify-start">
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="px-5 py-4 glass-dark rounded-2xl border border-white/10 flex items-center gap-3 shadow-lg shadow-purple-900/10"
                      >
                        {isAnalyzingImage ? (
                          <>
                            <div className="relative w-8 h-8 flex items-center justify-center">
                              <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin"></div>
                              <Camera size={14} className="text-purple-300" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white/80">Analyzing image...</span>
                              <span className="text-xs text-white/40">Extracting text & context with AI Vision</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="relative w-8 h-8 flex items-center justify-center">
                              <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-400 animate-spin"></div>
                              <Bot size={14} className="text-blue-300" />
                            </div>
                            <span className="text-sm font-medium text-white/70">PathFinder is thinking...</span>
                          </>
                        )}
                      </motion.div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div
          className={`fixed bottom-0 p-3 pb-6 sm:p-6 md:p-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-all duration-300 ${tourStep === 2 ? 'z-[60]' : 'z-50'}
          left-0 right-0 
          xl:transition-[left,right] xl:duration-300 xl:ease-in-out
          ${isDesktopSidebarOpen ? 'xl:left-64' : 'xl:left-0'}
          ${isDesktopRightSidebarOpen ? 'xl:right-80' : 'xl:right-0'}
        `}>
          <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3 relative">
            {/* Step 2: Tour Tooltip */}
            <AnimatePresence>
              {tourStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-[calc(100%+1rem)] left-0 z-[70] p-5 glass-dark border-[1.5px] border-blue-500/50 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.2)] w-[calc(100vw-2rem)] max-w-[20rem] md:w-[22rem] md:max-w-none backdrop-blur-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative p-3 bg-blue-500 rounded-xl shrink-0 shadow-lg">
                      <div className="absolute inset-0 bg-blue-400 rounded-xl animate-ping opacity-20"></div>
                      <Send size={20} className="text-white relative z-10" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-base text-blue-100">Command Center</h4>
                        <span className="text-[10px] font-bold tracking-wider text-blue-300/60 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">Step 2 of 3</span>
                      </div>
                      <p className="text-sm text-blue-200/80 mb-4 leading-relaxed">
                        Ask Pathfinder for career roadmaps, or upload documents using the camera icon.
                      </p>
                      <div className="flex items-center gap-3">
                        <button onClick={endTour} className="text-xs font-medium text-blue-200/50 hover:text-white transition-colors">
                          Skip Tour
                        </button>
                        <button onClick={handleTourNext} className="text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all flex-1 shadow-lg shadow-blue-500/20 active:scale-95">
                          Explore Panel →
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Arrow pointing Down */}
                  <div className="absolute left-10 -bottom-[9px] w-4 h-4 bg-[#1a1f35] border-b border-r border-[#1a1f35] rotate-45 shadow-[3px_3px_5px_rgba(59,130,246,0.1)]"></div>
                  <div className="absolute left-10 -bottom-2 w-4 h-4 bg-transparent border-b-[1.5px] border-r-[1.5px] border-blue-500/50 rotate-45 z-10 pointer-events-none"></div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`flex-1 min-w-0 bg-white/5 backdrop-blur-xl border-t-[3px] border-t-blue-500 border border-white/10 rounded-2xl flex items-center px-3 py-3 sm:px-6 sm:py-5 shadow-2xl shadow-blue-900/5 relative overflow-hidden group transition-all focus-within:shadow-blue-900/20 focus-within:bg-white/10 ${tourStep === 2 ? 'z-[60]' : ''}`}>

              {/* Dynamic Placeholder Animation */}
              <div className="absolute inset-0 flex items-center px-4 sm:px-6 pointer-events-none overflow-hidden">
                <AnimatePresence mode="wait">
                  {!inputText && (
                    <motion.span
                      key={placeholderIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-white/40 text-base font-medium truncate"
                    >
                      {CAREER_PROMPTS[placeholderIndex]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-transparent border-none focus:ring-0 text-white flex-1 outline-none text-base relative z-10 placeholder-transparent h-full min-w-0"
              />

              <div className="flex items-center gap-0.5 sm:gap-4 text-white/40 relative z-20 pl-1 sm:pl-4 shrink-0">
                <motion.button
                  onClick={toggleVoiceInput}
                  animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                  transition={isListening ? { repeat: Infinity, duration: 1.5 } : {}}
                  className={`${isListening ? 'text-red-500' : 'hover:text-blue-400'} transition-colors p-2 hover:bg-white/10 rounded-lg`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </motion.button>
                <button onClick={() => fileInputRef.current?.click()} className="hover:text-blue-400 transition-colors p-2 hover:bg-white/10 rounded-lg">
                  <Camera size={20} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }} />
              </div>

              {imagePreview && (
                <div className="absolute -top-24 left-0 p-2 glass-dark rounded-xl border border-white/20 shadow-xl">
                  <img src={imagePreview} className="h-20 w-20 object-cover rounded-lg" />
                  <button onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading}
              className="w-12 h-12 flex-shrink-0 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-purple-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </main>

      {/* Right Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isRightSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsRightSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] xl:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed xl:relative z-[60] h-full glass border-l border-white/5 transition-all duration-300 ease-in-out
        ${isRightSidebarOpen ? 'translate-x-0 right-0 w-full sm:w-80' : 'translate-x-full right-0 xl:translate-x-0 w-full sm:w-80'}
        ${isDesktopRightSidebarOpen ? 'xl:w-80 opacity-100 p-5 sm:p-8' : 'xl:w-0 opacity-0 p-0 overflow-hidden'}
        flex flex-col overflow-y-auto no-scrollbar
      `}>
        {/* Step 3: Tour Tooltip */}

        <div className="xl:hidden absolute top-4 left-4">
          <button onClick={() => setIsRightSidebarOpen(false)} className="p-2 text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <motion.div
          className="space-y-8 sm:space-y-12 min-w-0 sm:min-w-[280px] pt-12 xl:pt-0"
          variants={containerVariants}
          initial="hidden"
          animate={tourStep === 0 || tourStep === 3 || isRightSidebarOpen ? "visible" : "hidden"}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Trophy size={20} className="text-yellow-500" />
                <h3 className="font-bold text-lg">Scholarships</h3>
              </div>
              <button
                onClick={() => fetchDynamicData('scholarships')}
                disabled={isFetchingData}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
                title="Refresh with AI"
              >
                <div className={isFetchingData ? "animate-spin" : ""}>
                  <TrendingUp size={16} className="rotate-0" />
                </div>
              </button>
            </div>
            <div className="space-y-4">
              {scholarships.map(s => (
                <motion.div
                  key={s.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="p-4 glass-dark rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden"
                >
                  {s.category && (
                    <div className={`absolute top-0 right-0 px-2 py-1 rounded-bl-xl text-[8px] font-bold uppercase tracking-wider
                      ${s.category === 'Most Applied' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {s.category === 'Most Applied' ? '🔥 Top Choice' : '✅ Eligible'}
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2 mt-1">
                    <p className="font-bold text-xs flex-1 pr-6">{s.name}</p>
                    <div className="flex items-center gap-1.5 ml-2 mt-0.5">
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${s.status === 'Open' ? 'bg-green-400' : s.status === 'Closing Soon' ? 'bg-orange-400' : 'bg-red-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${s.status === 'Open' ? 'bg-green-500' : s.status === 'Closing Soon' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${s.status === 'Open' ? 'text-green-400' : s.status === 'Closing Soon' ? 'text-orange-400' : 'text-red-400'}`}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] opacity-50">{s.provider}</p>

                  <div className="flex justify-between items-end mt-3">
                    <p className="text-purple-400 font-bold text-xs">{s.amount}</p>
                    <div className="text-right">
                      <p className="text-[9px] font-medium text-white/50">
                        Deadline: <span className="text-white/80 font-bold">{s.deadline}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <a
                href="https://www.buddy4study.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 text-xs text-purple-400/80 hover:text-purple-300 font-medium hover:bg-white/5 rounded-xl transition-all"
              >
                View 250+ more on Buddy4Study ↗
              </a>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GraduationCap size={20} className="text-blue-400" />
                  <h3 className="font-bold text-lg">Top Universities</h3>
                </div>
                <button
                  onClick={() => fetchDynamicData('universities')}
                  disabled={isFetchingData}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
                  title="Refresh with AI"
                >
                  <div className={isFetchingData ? "animate-spin" : ""}>
                    <TrendingUp size={16} className="rotate-0" />
                  </div>
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2 flex-wrap">
                {(['All', 'IIT', 'NIT', 'Private', 'Govt', 'GFTI'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setUniFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all border
                      ${uniFilter === filter
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
              {universities
                .filter(u => uniFilter === 'All' || u.type === uniFilter)
                .slice(0, 150) // Show all matches
                .map((u) => (
                  <motion.div
                    key={u.name}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="p-4 glass-dark rounded-2xl border border-white/5 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 px-2 py-1 bg-white/10 rounded-bl-xl text-[8px] font-bold text-white/60">
                      Rank #{u.rank}
                    </div>

                    <div className="flex justify-between items-start mb-1 mt-2">
                      <p className="font-bold text-xs flex-1">{u.name}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] opacity-40">{u.location}</p>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider
                      ${u.type === 'IIT' ? 'bg-blue-500/20 text-blue-300' :
                          u.type === 'NIT' ? 'bg-purple-500/20 text-purple-300' :
                            u.type === 'Private' ? 'bg-emerald-500/20 text-emerald-300' :
                              'bg-orange-500/20 text-orange-300'}`}>
                        {u.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.div>
      </aside>
    </div>
  );
};

export default App;
