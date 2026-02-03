
'use client';

import { useState, useRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface MagnifierProps {
    src: string;
    width?: number | string;
    height?: number | string;
    magnifierHeight?: number;
    magnifierWidth?: number;
    zoomLevel?: number;
    className?: string;
}

export function Magnifier({
    src,
    width = '100%',
    height = 'auto',
    magnifierHeight = 150,
    magnifierWidth = 150,
    zoomLevel = 2.5,
    className,
}: MagnifierProps) {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [[x, y], setXY] = useState([0, 0]);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

    return (
        <div
            className={cn("relative inline-block", className)}
            style={{
                width,
                height,
            }}
        >
            <img
                src={src}
                className="w-full h-full object-contain"
                onMouseEnter={(e) => {
                    const elem = e.currentTarget;
                    const { width, height } = elem.getBoundingClientRect();
                    setSize([width, height]);
                    setShowMagnifier(true);
                }}
                onMouseMove={(e: MouseEvent) => {
                    const elem = e.currentTarget;
                    const { top, left } = elem.getBoundingClientRect();
                    const x = e.pageX - left - window.scrollX;
                    const y = e.pageY - top - window.scrollY;
                    setXY([x, y]);
                }}
                onMouseLeave={() => {
                    setShowMagnifier(false);
                }}
                alt="img-magnifier"
            />

            <div
                style={{
                    display: showMagnifier ? '' : 'none',
                    position: 'absolute',
                    pointerEvents: 'none',
                    height: `${magnifierHeight}px`,
                    width: `${magnifierWidth}px`,
                    top: `${y - magnifierHeight / 2}px`,
                    left: `${x - magnifierWidth / 2}px`,
                    opacity: '1',
                    border: '1px solid lightgray',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    backgroundImage: `url('${src}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                    backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
                    backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
            />
        </div>
    );
}
