import React, { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import type { PlanT } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';

interface SortablePlanItemProps {
    plan: PlanT;
    onRemove: (id: number) => void;
    onRenameClick: (id: number, name: string) => void;
    onClick: () => void;
}

const SortablePlanItem: React.FC<SortablePlanItemProps> = ({ plan, onRemove, onRenameClick, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: plan.id });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(isMenuOpen, () => setIsMenuOpen(false), [menuRef]);

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.8 : 1,
    };

    const stopP = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="plan-card"
            {...attributes}
            {...listeners}
            onClick={onClick}
        >
            <span>{plan.name}</span>
            <div className="settings-container" ref={menuRef} onClick={stopP} onPointerDown={(e) => e.stopPropagation()}>
                <button className="settings-btn" onClick={(e) => { stopP(e); setIsMenuOpen(v => !v); }}>⚙️</button>
                {isMenuOpen && (
                    <div className="settings-menu">
                        <button className="menu-item" onClick={(e) => {
                            stopP(e);
                            onRenameClick(plan.id, plan.name);
                            setIsMenuOpen(false);
                        }}>✏️ Edytuj nazwę</button>
                        <button className="menu-item delete" onClick={(e) => {
                            stopP(e);
                            if (window.confirm(`Czy na pewno usunąć plan: ${plan.name}?`)) onRemove(plan.id);
                            setIsMenuOpen(false);
                        }}>🗑️ Usuń plan</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SortablePlanItem;
