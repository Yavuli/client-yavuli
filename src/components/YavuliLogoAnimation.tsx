import React from 'react';
import './YavuliLogoAnimation.css';

const YavuliLogoAnimation = ({ className = "max-w-[200px]" }: { className?: string }) => {
    return (
        <div className={`w-full ${className} select-none pointer-events-none flex items-center`}>
            <svg viewBox="0 0 800 280" className="w-full h-auto overflow-visible">
                <g transform="translate(40, 0)">
                    <text x="40" y="220" className="yavuli-letter char-y" fill="#0f172a">Y</text>
                    <text x="165" y="220" className="yavuli-letter char-a" fill="#0f172a">A</text>
                    <text x="305" y="220" className="yavuli-letter char-v" fill="#0f172a">V</text>
                    <text x="435" y="220" className="yavuli-letter char-u" fill="#0f172a">U</text>
                    <text x="575" y="220" className="yavuli-letter char-l" fill="#0f172a">L</text>
                    <text x="680" y="220" className="yavuli-letter char-i" fill="#0f172a">I</text>

                    {/* Adjusted positions for icons to sit nicely around letters */}
                    <g className="grad-cap">
                        <polygon points="0,20 50,5 100,20 50,35" fill="#6c6b85ff" stroke="#0f172a" strokeWidth="3" />
                        <path d="M25,30 L25,50 C25,55 75,55 75,50 L75,30" fill="#74738dff" stroke="#0f172a" strokeWidth="3" />
                        <line x1="100" y1="20" x2="100" y2="60" stroke="#3b3629ff" strokeWidth="2" />
                        <circle cx="100" cy="60" r="4" fill="#3a3529ff" />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default YavuliLogoAnimation;