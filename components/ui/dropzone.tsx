
'use client';

import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DropzoneProps {
    onDrop: (file: File) => void;
    disabled?: boolean;
}

export function Dropzone({ onDrop, disabled }: DropzoneProps) {
    const handleDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (acceptedFiles.length > 0) {
                onDrop(acceptedFiles[0]);
            }

            if (fileRejections.length > 0) {
                console.warn('Rejected files:', fileRejections);
                // Could add toast notification here
            }
        },
        [onDrop]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop: handleDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
        disabled,
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative group cursor-pointer flex flex-col items-center justify-center w-full h-80 rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out bg-white/5 backdrop-blur-sm overflow-hidden',
                isDragActive
                    ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02] shadow-xl shadow-indigo-500/20'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50',
                isDragReject && 'border-red-500 bg-red-500/10',
                disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
            )}
        >
            <input {...getInputProps()} />

            <AnimatePresence>
                {isDragActive ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-500/5 backdrop-blur-sm z-10"
                    >
                        <UploadCloud className="w-16 h-16 text-indigo-600 mb-4 animate-bounce" />
                        <p className="text-xl font-bold text-indigo-700">Drop your image here!</p>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-20 h-20 mb-6 rounded-2xl bg-indigo-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                            <UploadCloud className="w-10 h-10 text-indigo-500" />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                            Upload an Image
                        </h3>

                        <p className="text-slate-500 max-w-xs mb-6">
                            Drag and drop an image here, or click to select from your files.
                        </p>

                        <div className="flex gap-4 text-xs text-slate-400 font-medium bg-slate-100 py-2 px-4 rounded-full">
                            <span>JPG</span>
                            <span className="w-px h-4 bg-slate-300"></span>
                            <span>PNG</span>
                            <span className="w-px h-4 bg-slate-300"></span>
                            <span>WebP</span>
                            <span className="w-px h-4 bg-slate-300"></span>
                            <span>Max 10MB</span>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
