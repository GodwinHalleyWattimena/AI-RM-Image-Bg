
'use client';

import { motion } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';
import { FeatureType } from '@/lib/ai-service';

interface WelcomeHeroProps {
    onSelectFeature: (feature: FeatureType) => void;
}

const features = [
    {
        id: 'remove-bg',
        title: 'Remove Background',
        description: 'Instantly remove backgrounds from any image with high precision.',
        icon: Layers,
        color: 'bg-indigo-500',
        textColor: 'text-indigo-600',
        gradient: 'from-indigo-500 to-purple-600'
    }
] as const;

export function WelcomeHero({ onSelectFeature }: WelcomeHeroProps) {
    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center">

            <div className="text-center mb-16 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold mb-6 border border-slate-200">
                        ✨ Next-Gen AI Image Suite
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                        Transform your images with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI Magic</span>
                    </h1>
                    <p className="text-xl text-slate-500 leading-relaxed">
                        Instant Background Removal powered by AI.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 w-full max-w-md">
                {features.map((feature, index) => (
                    <motion.button
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        onClick={() => onSelectFeature(feature.id as FeatureType)}
                        className="group relative flex flex-col items-start p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left overflow-hidden h-full"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 blur-2xl rounded-bl-full group-hover:opacity-20 transition-opacity`} />

                        <div className={`w-14 h-14 rounded-2xl ${feature.color} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                            <feature.icon className={`w-7 h-7 ${feature.textColor}`} />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed flex-grow">
                            {feature.description}
                        </p>

                        <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:gap-4 transition-all">
                            Try Now <ArrowRight size={18} />
                        </div>
                    </motion.button>
                ))}
            </div>

        </section>
    );
}
