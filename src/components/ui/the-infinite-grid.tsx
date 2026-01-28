import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
    motion,
    useMotionValue,
    useMotionTemplate,
    useAnimationFrame
} from "framer-motion";

export const TheInfiniteGrid = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const gridOffsetX = useMotionValue(0);
    const gridOffsetY = useMotionValue(0);

    const speedX = 0.5;
    const speedY = 0.5;

    useAnimationFrame(() => {
        const currentX = gridOffsetX.get();
        const currentY = gridOffsetY.get();
        gridOffsetX.set((currentX + speedX) % 40);
        gridOffsetY.set((currentY + speedY) % 40);
    });

    const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={cn(
                "relative w-full h-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white"
            )}
        >
            <div className="absolute inset-0 z-0 opacity-[0.1]">
                <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
            </div>
            <motion.div
                className="absolute inset-0 z-0 opacity-100"
                style={{ maskImage, WebkitMaskImage: maskImage }}
            >
                <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} isHighlighted />
            </motion.div>

            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute right-[-10%] top-[-10%] w-[40%] h-[40%] rounded-full bg-orange-200/40 blur-[100px]" />
                <div className="absolute right-[5%] top-[-5%] w-[20%] h-[20%] rounded-full bg-primary/10 blur-[80px]" />
                <div className="absolute left-[-5%] bottom-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[100px]" />
            </div>

            <div className="relative z-10 w-full h-full">
                {/* Content will be injected here if needed, or this component will be used as a wrapper */}
            </div>
        </div>
    );
};

const GridPattern = ({ offsetX, offsetY, isHighlighted }: { offsetX: any, offsetY: any, isHighlighted?: boolean }) => {
    return (
        <svg className="w-full h-full">
            <defs>
                <motion.pattern
                    id={isHighlighted ? "grid-highlight" : "grid-pattern"}
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                    x={offsetX}
                    y={offsetY}
                >
                    <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className={cn(isHighlighted ? "text-primary/30" : "text-slate-200")}
                    />
                </motion.pattern>
            </defs>
            <rect width="100%" height="100%" fill={isHighlighted ? "url(#grid-highlight)" : "url(#grid-pattern)"} />
        </svg>
    );
};
