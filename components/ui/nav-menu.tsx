
'use client';

import { motion } from 'framer-motion';
import { Layers, Zap, Sparkles, FileVideo } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FeatureType = 'remove-bg' | 'upscale' | 'restore-face' | 'compress';

interface NavMenuProps {
    activeTab: FeatureType;
    onTabChange: (tab: FeatureType) => void;
    disabled?: boolean;
}

export function NavMenu({ activeTab, onTabChange, disabled }: NavMenuProps) {
    const tabs = [
        { id: 'remove-bg', label: 'Remove BG', icon: Layers, color: 'text-indigo-600' },
        { id: 'upscale', label: 'AI Upscale', icon: Zap, color: 'text-amber-600' },
        { id: 'restore-face', label: 'Face Restore', icon: Sparkles, color: 'text-purple-600' },
        { id: 'compress', label: 'Compress', icon: FileVideo, color: 'text-emerald-600' },
    ] as const;

    return (
        <div className="flex flex-wrap justify-center gap-2 mb-8 p-2 bg-slate-100/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 w-full max-w-2xl mx-auto">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        disabled={disabled}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300",
                            isActive
                                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="nav-pill"
                                className="absolute inset-0 bg-white rounded-xl shadow-sm z-0"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className={cn("relative z-10 flex items-center gap-2", isActive ? tab.color : "")}>
                            <Icon size={18} />
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
