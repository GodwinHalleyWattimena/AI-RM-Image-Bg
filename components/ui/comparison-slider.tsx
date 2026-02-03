
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Divide, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have this utility

interface ComparisonSliderProps {
    original: string;
    processed: string;
    className?: string;
}

export function ComparisonSlider({ original, processed, className }: ComparisonSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback(() => setIsResizing(true), []);
    const handleMouseUp = useCallback(() => setIsResizing(false), []);

    const handleMouseMove = useCallback(
        (e: MouseEvent | React.MouseEvent) => {
            if (!isResizing || !containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const x = (e as MouseEvent).clientX - rect.left;
            const position = (x / rect.width) * 100;

            setSliderPosition(Math.min(Math.max(position, 0), 100));
        },
        [isResizing]
    );

    const handleTouchMove = useCallback(
        (e: TouchEvent | React.TouchEvent) => {
            if (!isResizing || !containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            // Use the first touch point
            const x = (e as TouchEvent).touches[0].clientX - rect.left;
            const position = (x / rect.width) * 100;

            setSliderPosition(Math.min(Math.max(position, 0), 100));
        },
        [isResizing]
    );

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove as any);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove as any);
            window.addEventListener('touchend', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove as any);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove as any);
            window.removeEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove as any);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove as any);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp, handleTouchMove]);

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden select-none cursor-ew-resize group shadow-2xl shadow-indigo-500/10 border border-white/20',
                className
            )}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* Background (Processed Image) - Shows fully when slider is at 0 */}
            <img
                src={processed}
                alt="Processed"
                className="absolute inset-0 w-full h-full object-contain bg-[url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.8-j6gq6HjN8W4c4xX8_9kQHaHa%26pid%3DApi&f=1&ipt=b519302688009d3161f3647171960250640032f30501a5202685764d26211756&ipo=images')] bg-repeat"
                // Using a checkered pattern background for transparency visualization
                draggable={false}
            />

            {/* Foreground (Original Image) - Clipped */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={original}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-contain bg-white"
                    draggable={false}
                />
                {/* Label Left */}
                <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                    Original
                </div>
            </div>

            {/* Label Right - needs to be separate to not be clipped if we want it always valid, 
           but usually we want labels inside their respective sections.
           Let's put the processed label in the background layer but high z-index? 
           Actually, simpler to just have them inside the clipped areas or floating on top conditionally.
       */}
            <div className='absolute top-4 right-4 bg-indigo-600/80 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm shadow-lg'>
                Removed
            </div>


            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-600 hover:scale-110 transition-transform">
                    <GripVertical size={16} />
                </div>
            </div>
        </div>
    );
}
