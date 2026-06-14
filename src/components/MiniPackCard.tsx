import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSortable } from '@dnd-kit/sortable';
import type { PackList } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';
import '../PDetStyle.css';

interface MiniPackCardProps {
    pack: PackList;
    isSelected: boolean;
    onSelect: () => void;
    onEditName: () => void;
    onRemove: () => void;
}

const MiniPackCard: React.FC<MiniPackCardProps> = ({ pack, isSelected, onSelect, onEditName, onRemove }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const cardRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const gearRef = useRef<HTMLButtonElement>(null);
    const didDragRef = useRef(false);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: pack.id });

    useClickOutside(isMenuOpen, () => setIsMenuOpen(false), [menuRef, gearRef]);

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    useEffect(() => {
        if (isDragging) didDragRef.current = true;
    }, [isDragging]);

    const setRefs = (el: HTMLDivElement | null) => {
        setNodeRef(el);
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    };

    const openMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setMenuPos({ top: rect.top + window.scrollY, left: rect.right + window.scrollX + 8 });
        }
        setIsMenuOpen(v => !v);
    };

    return (
        <div
            ref={setRefs}
            style={style}
            className={`mini-day-card ${isSelected ? 'mini-day-card--active' : ''}`}
            onClick={() => {
                if (didDragRef.current) { didDragRef.current = false; return; }
                onSelect();
            }}
            {...attributes}
            {...listeners}
        >
            <span className="mini-day-card__name">{pack.name}</span>
            <div className="settings-container mini-day-settings" onPointerDown={(e) => e.stopPropagation()}>
                <button ref={gearRef} className="settings-btn" onClick={openMenu}>⚙️</button>
            </div>

            {isMenuOpen && createPortal(
                <div
                    ref={menuRef}
                    className="settings-menu"
                    style={{ position: 'absolute', top: menuPos.top, left: menuPos.left, zIndex: 9999, width: 'fit-content', minWidth: '160px' }}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <button className="menu-item" onClick={(e) => { e.stopPropagation(); onEditName(); setIsMenuOpen(false); }}>✏️ Edytuj nazwę</button>
                    <button className="menu-item delete" onClick={(e) => { e.stopPropagation(); if (window.confirm('Czy na pewno usunąć tę listę?')) onRemove(); setIsMenuOpen(false); }}>🗑️ Usuń listę</button>
                </div>,
                document.body
            )}
        </div>
    );
};

export default MiniPackCard;
