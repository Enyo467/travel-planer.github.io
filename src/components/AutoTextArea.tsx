import React, { useRef, useEffect } from 'react';

interface AutoTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
    onUpdate: (val: string) => void;
    onEnter?: () => void;
}

const AutoTextArea: React.FC<AutoTextAreaProps> = ({ value, onUpdate, onEnter, className, ...props }) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = '32px';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const list = textAreaRef.current?.closest('.activity-list');
            if (list) {
                const textareas = Array.from(list.querySelectorAll('textarea')) as HTMLTextAreaElement[];
                const currentIndex = textareas.indexOf(textAreaRef.current!);
                if (e.key === 'ArrowUp' && currentIndex > 0) {
                    e.preventDefault();
                    textareas[currentIndex - 1].focus();
                } else if (e.key === 'ArrowDown' && currentIndex < textareas.length - 1) {
                    e.preventDefault();
                    textareas[currentIndex + 1].focus();
                }
            }
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const list = textAreaRef.current?.closest('.activity-list');
            if (list) {
                const textareas = Array.from(list.querySelectorAll('textarea')) as HTMLTextAreaElement[];
                const currentIndex = textareas.indexOf(textAreaRef.current!);
                const isLast = currentIndex === textareas.length - 1;

                if (!isLast) {
                    // Przejdź do następnego
                    textareas[currentIndex + 1].focus();
                } else {
                    // Ostatni — dodaj nowy i przejdź na niego
                    onEnter?.();
                    setTimeout(() => {
                        const updated = Array.from(list.querySelectorAll('textarea')) as HTMLTextAreaElement[];
                        updated[updated.length - 1]?.focus();
                    }, 0);
                }
            }
        }
        props.onKeyDown?.(e);
    };

    return (
        <textarea
            {...props}
            ref={textAreaRef}
            className={className}
            value={value}
            onChange={(e) => onUpdate(e.target.value)}
            onInput={adjustHeight}
            onKeyDown={handleKeyDown}
            rows={1}
        />
    );
};

export default AutoTextArea;
