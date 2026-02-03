'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Download, RefreshCw, AlertCircle, Copy, Check, ScanEye, ArrowLeft } from 'lucide-react';
import { Dropzone } from '@/components/ui/dropzone';
import { ComparisonSlider } from '@/components/ui/comparison-slider';
import { Magnifier } from '@/components/ui/magnifier';
// Removed NavMenu import as it's replaced by Welcome Page selection
import { WelcomeHero } from '@/components/ui/welcome-hero';
import { AIService, FeatureType, AIResult } from '@/lib/ai-service';
import { cn } from '@/lib/utils';

type AppState = 'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR';
type AppMode = 'WELCOME' | 'TOOL';

export default function BgRemoverApp() {
    // App Flow State
    const [appMode, setAppMode] = useState<AppMode>('WELCOME');
    // Active feature is kept for structure buy only supports 'remove-bg' now
    const [activeFeature, setActiveFeature] = useState<FeatureType>('remove-bg');

    // Tool State
    const [status, setStatus] = useState<AppState>('IDLE');
    const [progressMsg, setProgressMsg] = useState('Processing...');

    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [magnifyMode, setMagnifyMode] = useState(false);

    // Stats
    const [stats, setStats] = useState<{ origSize?: string; newSize?: string }>({});

    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Helper to format bytes
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // --- Actions ---

    const handleFeatureSelect = (feature: FeatureType) => {
        setActiveFeature(feature);
        setAppMode('TOOL');
        handleReset(); // Ensure clean state
    };

    const handleBackToWelcome = () => {
        setAppMode('WELCOME');
        handleReset();
    };

    const handleDrop = async (file: File) => {
        setStatus('UPLOADING');
        setError(null);
        setProcessedImage(null);
        setStats({ origSize: formatBytes(file.size) });
        setOriginalFile(file);

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setOriginalImage(objectUrl);

        // Execute processing
        await processImage(file);
    };

    const processImage = async (file: File) => {
        try {
            let result: AIResult | undefined;

            if (activeFeature === 'remove-bg') {
                setProgressMsg('AI Removing Background...');
                result = await AIService.removeBackground(file);
            } else {
                throw new Error("Unknown Feature Selected");
            }

            if (result) {
                setProcessedImage(result.url);
                const stats = result.stats;
                if (stats) {
                    setStats(prev => ({
                        ...prev,
                        newSize: formatBytes(stats.newSize)
                    }));
                }
                setStatus('SUCCESS');
            }

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setStatus('ERROR');
        }
    };

    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `ai-${activeFeature}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setStatus('IDLE');
        setOriginalImage(null);
        setOriginalFile(null);
        setProcessedImage(null);
        setError(null);
        setStats({});
    };

    const copyToClipboard = async () => {
        if (!processedImage) return;
        try {
            const response = await fetch(processedImage);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob })
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    // --- Render ---

    return (
        <div className="w-full min-h-screen">
            <AnimatePresence mode="wait">

                {/* MODE: WELCOME SCREEN */}
                {appMode === 'WELCOME' && (
                    <motion.div
                        key="welcome"
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full"
                    >
                        <WelcomeHero onSelectFeature={handleFeatureSelect} />
                    </motion.div>
                )}

                {/* MODE: TOOL SCREEN */}
                {appMode === 'TOOL' && (
                    <motion.div
                        key="tool"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="w-full max-w-5xl mx-auto p-4 md:p-8"
                    >
                        {/* Back Button */}
                        <button
                            onClick={handleBackToWelcome}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Menu
                        </button>

                        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-6 md:p-12 overflow-hidden relative min-h-[600px]">

                            {/* Blobs */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200/50 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

                            {/* IDLE */}
                            {status === 'IDLE' && (
                                <div className="relative z-10">
                                    <div className="text-center mb-10">
                                        <h2 className="text-3xl font-black text-slate-900 mb-2 capitalize">
                                            {activeFeature.replace('-', ' ')}
                                        </h2>
                                        <p className="text-slate-500">
                                            Upload your image to start processing.
                                        </p>
                                    </div>
                                    <Dropzone onDrop={handleDrop} />
                                </div>
                            )}

                            {/* UPLOADING */}
                            {status === 'UPLOADING' && (
                                <div className="flex flex-col items-center justify-center min-h-[400px] relative z-10">
                                    {originalImage && (
                                        <div className="w-32 h-32 rounded-2xl overflow-hidden mb-8 shadow-xl border-4 border-white relative">
                                            <img src={originalImage} alt="Preview" className="w-full h-full object-cover opacity-50" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                                            </div>
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{progressMsg}</h3>
                                    <p className="text-slate-500 animate-pulse">Running AI Model...</p>
                                </div>
                            )}

                            {/* SUCCESS */}
                            {status === 'SUCCESS' && originalImage && processedImage && (
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                                        <div>
                                            <h2 className="text-3xl font-bold text-slate-900 mb-1">Success! ✨</h2>
                                            {stats.newSize && <p className="text-slate-500 text-sm">Size: {stats.origSize} → <span className="text-green-600 font-bold">{stats.newSize}</span></p>}
                                        </div>
                                        <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-600 text-sm font-medium">
                                            <RefreshCw size={16} /> Process Another
                                        </button>
                                    </div>

                                    <div className="mb-8 relative group">
                                        <button
                                            onClick={() => setMagnifyMode(!magnifyMode)}
                                            className={cn(
                                                "absolute top-4 left-4 z-30 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-2",
                                                magnifyMode ? "bg-indigo-600 text-white" : "bg-white/90 text-slate-700 hover:bg-white"
                                            )}
                                        >
                                            <ScanEye size={14} /> {magnifyMode ? 'Disable Magnifier' : 'Enable Magnifier'}
                                        </button>

                                        {magnifyMode ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><p className="font-bold text-slate-500 mb-2 text-center">Original</p><Magnifier src={originalImage} className="rounded-2xl border-2 border-slate-200" /></div>
                                                <div><p className="font-bold text-indigo-600 mb-2 text-center">Result</p><Magnifier src={processedImage} className="rounded-2xl border-2 border-indigo-200" /></div>
                                            </div>
                                        ) : (
                                            <ComparisonSlider original={originalImage} processed={processedImage} />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button onClick={copyToClipboard} className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-indigo-500 hover:text-indigo-600 transition-all">
                                            {copied ? <Check className="text-green-500" /> : <Copy />} Copy Image
                                        </button>
                                        <button onClick={handleDownload} className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                            <Download /> Download HD
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ERROR */}
                            {status === 'ERROR' && (
                                <div className="flex flex-col items-center justify-center min-h-[400px] text-center relative z-10">
                                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Error Processing Image</h3>
                                    <p className="text-red-500 bg-red-50 px-4 py-2 rounded-lg mb-8">{error}</p>
                                    <button onClick={handleReset} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium">Try Again</button>
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
