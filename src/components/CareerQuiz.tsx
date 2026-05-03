import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, GraduationCap, Target, Briefcase, Globe, Award } from 'lucide-react';

interface CareerQuizProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (prompt: string) => void;
}

const CareerQuiz: React.FC<CareerQuizProps> = ({ isOpen, onClose, onSubmit }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    const [formData, setFormData] = useState({
        educationLevel: '',
        currentStream: '',
        careerGoals: [] as string[],
        preferredLocations: [] as string[],
        academicPerformance: ''
    });

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };


    // ... (existing code)

    const handleSubmit = async () => {
        const prompt = `
      Based on my profile, please provide a detailed career roadmap and scholarship opportunities.
      
      **Profile:**
      - **Current Education Level:** ${formData.educationLevel}
      - **Stream/Major:** ${formData.currentStream}
      - **Career Goals:** ${formData.careerGoals.join(', ')}
      - **Preferred Locations/Universities:** ${formData.preferredLocations.join(', ')}
      - **Academic Performance:** ${formData.academicPerformance}
      
      Please include:
      1. Step-by-step career path.
      2. Top 5 universities/colleges matching my preferences.
      3. Relevant scholarships I am eligible for (with deadlines).
      4. Skills I need to acquire immediately.
    `;

        // Call OpenAI service
        // Creating a simple history object as per the new service signature
        const history: { role: 'user' | 'assistant'; content: string }[] = [];

        // Assuming onSubmit handles the response or state update in the parent component
        // But looking at the original code, onSubmit(prompt) suggests it might be handling the API call itself?
        // Let's check the original code again.
        // Original: onSubmit(prompt); onClose();

        // Wait, the original code just called onSubmit(prompt). 
        // This means the API call was likely happening in the PARENT component of CareerQuiz.
        // I need to check where CareerQuiz is used!

        onSubmit(prompt);
        onClose();
        setStep(1);
    };

    const updateFormData = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleSelection = (field: 'careerGoals' | 'preferredLocations', value: string) => {
        setFormData(prev => {
            const current = prev[field];
            const newValues = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [field]: newValues };
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1a1f35] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Career Pathfinder Quiz
                        </h2>
                        <p className="text-white/60 text-sm">Step {step} of {totalSteps}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-white/5 w-full">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <Step1 level={formData.educationLevel} onChange={(val) => updateFormData('educationLevel', val)} />
                        )}
                        {step === 2 && (
                            <Step2 stream={formData.currentStream} onChange={(val) => updateFormData('currentStream', val)} />
                        )}
                        {step === 3 && (
                            <Step3 goals={formData.careerGoals} onToggle={(val) => toggleSelection('careerGoals', val)} />
                        )}
                        {step === 4 && (
                            <Step4 locations={formData.preferredLocations} onToggle={(val) => toggleSelection('preferredLocations', val)} />
                        )}
                        {step === 5 && (
                            <Step5 performance={formData.academicPerformance} onChange={(val) => updateFormData('academicPerformance', val)} />
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-between items-center bg-black/20">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
              ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        <ChevronLeft size={20} /> Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-900/20 transform active:scale-95 transition-all text-white"
                    >
                        {step === totalSteps ? 'Generate Roadmap' : 'Next'}
                        {step !== totalSteps && <ChevronRight size={20} />}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// --- Sub-components for Steps ---

const Step1 = ({ level, onChange }: { level: string, onChange: (v: string) => void }) => {
    const options = [
        { label: "High School (10th)", icon: <GraduationCap size={24} /> },
        { label: "Intermediate (12th)", icon: <GraduationCap size={24} /> },
        { label: "Undergraduate (B.Tech/BCA/B.Sc)", icon: <Briefcase size={24} /> },
        { label: "Postgraduate (M.Tech/MCA/MBA)", icon: <Briefcase size={24} /> },
        { label: "Working Professional", icon: <Briefcase size={24} /> },
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <GraduationCap className="text-blue-400" /> What is your current education status?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.label}
                        onClick={() => onChange(opt.label)}
                        className={`p-4 rounded-xl border flex items-center gap-4 text-left transition-all
              ${level === opt.label
                                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'}`}
                    >
                        <div className={`p-3 rounded-lg ${level === opt.label ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/60'}`}>
                            {opt.icon}
                        </div>
                        <span className="font-medium text-lg">{opt.label}</span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

const Step2 = ({ stream, onChange }: { stream: string, onChange: (v: string) => void }) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
            <Briefcase className="text-purple-400" /> What is your current Stream or Major?
        </h3>
        <div className="space-y-4">
            <input
                type="text"
                value={stream}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g. Computer Science, PCM, Commerce, Mechanical Engineering..."
                className="w-full p-5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:bg-white/10 text-white placeholder-white/30 text-lg outline-none transition-all"
                autoFocus
            />
            <div className="flex flex-wrap gap-2 mt-4">
                {["Computer Science", "PCM (Physics, Chem, Math)", "Commerce", "Arts", "Electronics", "Mechanical"].map(s => (
                    <button
                        key={s}
                        onClick={() => onChange(s)}
                        className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/70 transition-all font-medium"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    </motion.div>
);

const Step3 = ({ goals, onToggle }: { goals: string[], onToggle: (v: string) => void }) => {
    const options = [
        "Software Engineering", "Artificial Intelligence", "Data Science", "Cybersecurity",
        "Defence Services (Army/Navy/Air Force)", "Civil Services / Govt Exams (UPSC/SSC)",
        "Product Management", "Higher Studies (Masters/PhD)", "Entrepreneurship", "Study Abroad"
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <Target className="text-green-400" /> What are your future goals? (Select multiple)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => onToggle(opt)}
                        className={`p-3 rounded-xl border text-sm font-medium text-left transition-all flex items-center gap-3
              ${goals.includes(opt)
                                ? 'bg-green-500/20 border-green-500 text-green-100'
                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                    >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${goals.includes(opt) ? 'bg-green-500 border-green-500' : 'border-white/30'}`}>
                            {goals.includes(opt) && <span className="text-white text-xs">✓</span>}
                        </div>
                        {opt}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

const Step4 = ({ locations, onToggle }: { locations: string[], onToggle: (v: string) => void }) => {
    const options = [
        "India (IITs/NITs)", "USA", "UK", "Canada", "Germany", "Australia",
        "Remote / Online", "Bangalore", "Delhi NCR", "Mumbai"
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <Globe className="text-orange-400" /> Preferred Locations or Universities?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => onToggle(opt)}
                        className={`p-3 rounded-xl border text-sm font-medium text-left transition-all flex items-center gap-3
              ${locations.includes(opt)
                                ? 'bg-orange-500/20 border-orange-500 text-orange-100'
                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                    >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${locations.includes(opt) ? 'bg-orange-500 border-orange-500' : 'border-white/30'}`}>
                            {locations.includes(opt) && <span className="text-white text-xs">✓</span>}
                        </div>
                        {opt}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

const Step5 = ({ performance, onChange }: { performance: string, onChange: (v: string) => void }) => {
    const options = [
        { label: "Top 1% (95%+) - Gold Medalist", desc: "Eligible for top scholarships" },
        { label: "Top 10% (85-95%)", desc: "Strong academic record" },
        { label: "Above Average (75-85%)", desc: "Good potential" },
        { label: "Average (60-75%)", desc: "Focus on skill-building" },
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <Award className="text-yellow-400" /> How would you rate your academic performance?
            </h3>
            <div className="space-y-3">
                {options.map((opt) => (
                    <button
                        key={opt.label}
                        onClick={() => onChange(opt.label)}
                        className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all
              ${performance === opt.label
                                ? 'bg-yellow-500/20 border-yellow-500 text-white'
                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                    >
                        <div>
                            <span className="font-bold text-lg block">{opt.label}</span>
                            <span className="text-sm opacity-60 font-medium">{opt.desc}</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${performance === opt.label ? 'border-yellow-500' : 'border-white/20'}`}>
                            {performance === opt.label && <div className="w-3 h-3 bg-yellow-500 rounded-full" />}
                        </div>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default CareerQuiz;
