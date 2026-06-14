import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import type { PackList, StuffList } from '../types';
import AutoTextArea from './AutoTextArea';

interface StuffRowProps {
    s: StuffList;
    onChangeDone: () => void;
    onUpdate: (val: string) => void;
    onDelete: () => void;
    onAddNext: () => void;
    stopP: (e: React.SyntheticEvent) => void;
    isMoving: boolean;
}

const StuffRow: React.FC<StuffRowProps> = ({ s, onChangeDone, onUpdate, onDelete, onAddNext, stopP, isMoving }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: s.id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout={!isDragging}
            transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 35 }}
            className={`packing-item${isMoving ? ' packing-moving' : ''}`}
        >
            <button
                className="drag-handle"
                {...attributes}
                {...listeners}
                onPointerDown={(e) => { e.stopPropagation(); (listeners as any)?.onPointerDown?.(e); }}
                tabIndex={-1}
            >
                <svg width="14" height="10" viewBox="0 0 14 10" className="drag-handle-icon">
                    <rect x="0" y="0" width="14" height="2" rx="1"/>
                    <rect x="0" y="4" width="14" height="2" rx="1"/>
                    <rect x="0" y="8" width="14" height="2" rx="1"/>
                </svg>
            </button>

            <button className={`checkbox-btn ${s.done ? 'done' : ''}`} onPointerDown={stopP} onClick={onChangeDone} />
            <AutoTextArea
                className={`item-input ${s.done ? 'done' : ''}`}
                value={s.name}
                onUpdate={onUpdate}
                onEnter={onAddNext}
                onPointerDown={stopP}
                data-done={s.done ? 'true' : 'false'}
            />
            <button className="icon-btn" onPointerDown={stopP} onClick={onDelete}>🗑️</button>
        </motion.div>
    );
};

interface PackItemProps {
    pack: PackList;
    onChangeDone: (stuffId: number) => void;
    onUpdateStuff: (stuffId: number, val: string) => void;
    onAddStuff: () => void;
    onDeleteStuff: (stuffId: number) => void;
    onRemovePack: () => void;
    onEditPackName: () => void;
    onReorderStuff: (newStuff: StuffList[]) => void;
    hideSettings?: boolean;
}

const PackItem: React.FC<PackItemProps> = ({
    pack, onChangeDone, onUpdateStuff, onAddStuff, onDeleteStuff,
    onRemovePack, onEditPackName, onReorderStuff, hideSettings
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [movingId, setMovingId] = useState<number | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: pack.id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.8 : 1
    };

    const stopP = (e: React.SyntheticEvent) => e.stopPropagation();
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleToggle = (id: number) => {
        setMovingId(id);
        setTimeout(() => {
            onChangeDone(id);
            setMovingId(null);
        }, 320);
    };

    const handleAddStuff = () => {
        onAddStuff();
        setTimeout(() => {
            const textareas = listRef.current?.querySelectorAll<HTMLTextAreaElement>('textarea[data-done="false"]');
            if (textareas && textareas.length > 0) textareas[textareas.length - 1].focus();
        }, 0);
    };

    const handleStuffDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = pack.stuff.findIndex(s => s.id === active.id);
        const newIndex = pack.stuff.findIndex(s => s.id === over.id);
        onReorderStuff(arrayMove(pack.stuff, oldIndex, newIndex));
    };

    return (
        <div ref={setNodeRef} style={style} className="detail-card" {...attributes} {...listeners}>
            {!hideSettings && (
                <div className="settings-container" onPointerDown={stopP}>
                    <button className="settings-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>⚙️</button>
                    {isMenuOpen && (
                        <div className="settings-menu">
                            <button className="menu-item" onClick={() => { onEditPackName(); setIsMenuOpen(false); }}>✏️ Edytuj nazwę</button>
                            <button className="menu-item delete" onClick={() => { if (window.confirm('Czy na pewno usunąć tę listę?')) onRemovePack(); setIsMenuOpen(false); }}>🗑️ Usuń listę</button>
                        </div>
                    )}
                </div>
            )}
            <h2 className="card-title">{pack.name}</h2>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleStuffDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
                <SortableContext items={pack.stuff.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <AnimatePresence>
                        <div className="activity-list" onPointerDown={stopP} ref={listRef}>
                            {pack.stuff.map(s => (
                                <StuffRow
                                    key={s.id}
                                    s={s}
                                    isMoving={movingId === s.id}
                                    onChangeDone={() => handleToggle(s.id)}
                                    onUpdate={(val) => onUpdateStuff(s.id, val)}
                                    onDelete={() => onDeleteStuff(s.id)}
                                    onAddNext={onAddStuff}
                                    stopP={stopP}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                </SortableContext>
            </DndContext>

            <button className="add-item-btn" onPointerDown={stopP} onClick={handleAddStuff}>+</button>
        </div>
    );
};

export default PackItem;
