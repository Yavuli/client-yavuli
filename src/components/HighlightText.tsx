import React from 'react';

interface HighlightTextProps {
    text: string;
    query: string;
    /** Extra CSS classes for the highlight mark */
    className?: string;
}

/**
 * Renders text with matching portions highlighted.
 * Case-insensitive matching. If query is empty, renders plain text.
 */
const HighlightText: React.FC<HighlightTextProps> = ({
    text,
    query,
    className = '',
}) => {
    if (!query || !text) return <>{text}</>;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark
                        key={i}
                        className={`bg-amber-300/70 dark:bg-amber-500/40 text-inherit rounded-sm px-0.5 ${className}`}
                    >
                        {part}
                    </mark>
                ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                )
            )}
        </>
    );
};

export default HighlightText;
