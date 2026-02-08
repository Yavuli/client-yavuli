
import React from 'react';
import './YavuliLogoAnimation.css';

const YavuliLogoAnimation = () => {
    return (
        <div className="w-full max-w-2xl mb-8 select-none pointer-events-none">
            <svg viewBox="0 0 800 280" className="w-full h-auto overflow-visible">
                <g transform="translate(40, 0)">
                    <text x="40" y="220" className="yavuli-letter char-y" fill="#2563EB">Y</text>
                    <text x="165" y="220" className="yavuli-letter char-a" fill="#059669">A</text>
                    <text x="305" y="220" className="yavuli-letter char-v" fill="#D97706">V</text>
                    <text x="435" y="220" className="yavuli-letter char-u" fill="#DC2626">U</text>
                    <text x="575" y="220" className="yavuli-letter char-l" fill="#7C3AED">L</text>
                    <text x="680" y="220" className="yavuli-letter char-i" fill="#DB2777">I</text>

                    <g className="shopping-bag">
                        <path d="M0,20 L50,20 L55,70 L-5,70 Z" fill="#EA580C" stroke="#0f172a" strokeWidth="3" />
                        <path d="M10,20 C10,-20 40,-20 40,20" fill="none" stroke="#0f172a" strokeWidth="3" />
                        <text x="13" y="55" fontSize="24">❤️</text>
                    </g>
                    <g className="grad-cap">
                        <polygon points="0,20 50,5 100,20 50,35" fill="#4F46E5" stroke="#0f172a" strokeWidth="3" />
                        <path d="M25,30 L25,50 C25,55 75,55 75,50 L75,30" fill="#4F46E5" stroke="#0f172a" strokeWidth="3" />
                        <line x1="100" y1="20" x2="100" y2="60" stroke="#FBBF24" strokeWidth="2" />
                        <circle cx="100" cy="60" r="4" fill="#FBBF24" />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default YavuliLogoAnimation;
