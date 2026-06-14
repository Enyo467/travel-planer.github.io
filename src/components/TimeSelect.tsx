import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './TimeSelect.css';

// Generuj wszystkie opcje co 15 minut
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
    for (const m of ['00', '15', '30', '45']) {
        TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${m}`);
    }
}

interface TimeSelectProps {
    value: string;
    onChange: (val: string) => void;
    onPointerDown?: (e: React.PointerEvent) => void;
}

const TimeSelect: React.FC<TimeSelectProps> = ({ value, onChange, onPointerDown }) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    const display = value || '08:00';

    const openDropdown = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX, width: rect.width });
        }
        setOpen(true);
    };

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (
                listRef.current && !listRef.current.contains(e.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(e.target as Node)
            ) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    useEffect(() => {
        if (open && listRef.current) {
            const active = listRef.current.querySelector('.ts-option--active') as HTMLElement;
            if (active) active.scrollIntoView({ block: 'nearest' });
        }
    }, [open]);

    return (
        <div className="time-select" onPointerDown={onPointerDown}>
            <button
                ref={triggerRef}
                type="button"
                className={`ts-trigger ts-trigger--single ${open ? 'ts-trigger--open' : ''}`}
                onPointerDown={e => e.stopPropagation()}
                onClick={() => open ? setOpen(false) : openDropdown()}
            >
                {display}
                <span className="ts-arrow">▾</span>
            </button>

            {open && createPortal(
                <div
                    ref={listRef}
                    className="ts-list"
                    style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
                    onPointerDown={e => e.stopPropagation()}
                >
                    {TIME_OPTIONS.map(opt => (
                        <div
                            key={opt}
                            className={`ts-option ${opt === display ? 'ts-option--active' : ''}`}
                            onClick={() => { onChange(opt); setOpen(false); }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
};

export default TimeSelect;
