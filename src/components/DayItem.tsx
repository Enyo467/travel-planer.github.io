import React, { useState, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Day, Actv } from '../types';
import AutoTextArea from './AutoTextArea';
import TimeSelect from './TimeSelect';

interface ActivityRowProps {
    act: Actv;
    onUpdate: (field: keyof Actv, val: string) => void;
    onDelete: () => void;
    onAddNext: () => void;
    stopP: (e: React.SyntheticEvent) => void;
    showTime: boolean;
}

const ActivityRow: React.FC<ActivityRowProps> = ({ act, onUpdate, onDelete, onAddNext, stopP, showTime }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: act.id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="activity-item">
            <button
                className="drag-handle"
                {...attributes}
                {...listeners}
                onPointerDown={(e) => { e.stopPropagation(); (listeners as any)?.onPointerDown?.(e); }}
                tabIndex={-1}
                aria-label="Przeciągnij aktywność"
            >
                <svg width="14" height="10" viewBox="0 0 14 10" className="drag-handle-icon">
                    <rect x="0" y="0" width="14" height="2" rx="1"/>
                    <rect x="0" y="4" width="14" height="2" rx="1"/>
                    <rect x="0" y="8" width="14" height="2" rx="1"/>
                </svg>
            </button>

            {showTime && (
                <TimeSelect
                    value={act.hour}
                    onChange={val => onUpdate('hour', val)}
                    onPointerDown={stopP}
                />
            )}
            <AutoTextArea
                className="activity-input"
                value={act.activity}
                onUpdate={(val) => onUpdate('activity', val)}
                onEnter={onAddNext}
                onPointerDown={stopP}
            />
            <button className="icon-btn" onPointerDown={stopP} onClick={onDelete}>🗑️</button>
        </div>
    );
};

interface DayItemProps {
    day: Day;
    onUpdateActivity: (actId: number, field: keyof Actv, val: string) => void;
    onAddActivity: () => void;
    onDeleteActivity: (actId: number) => void;
    onRemoveDay: () => void;
    onEditDayName: () => void;
    onReorderActivities: (newActvs: Actv[]) => void;
    hideSettings?: boolean;
}

const DayItem: React.FC<DayItemProps> = ({
    day, onUpdateActivity, onAddActivity, onDeleteActivity,
    onRemoveDay, onEditDayName, onReorderActivities, hideSettings
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: day.id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.8 : 1
    };

    const stopP = (e: React.SyntheticEvent) => e.stopPropagation();

    const handleAddActivity = () => {
        onAddActivity();
        setTimeout(() => {
            const textareas = listRef.current?.querySelectorAll<HTMLTextAreaElement>('textarea');
            if (textareas && textareas.length > 0) textareas[textareas.length - 1].focus();
        }, 0);
    };

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleActivityDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = day.actvs.findIndex(a => a.id === active.id);
        const newIndex = day.actvs.findIndex(a => a.id === over.id);
        onReorderActivities(arrayMove(day.actvs, oldIndex, newIndex));
    };

    return (
        <div ref={setNodeRef} style={style} className="detail-card" {...attributes} {...listeners}>
            {!hideSettings && (
                <div className="settings-container" onPointerDown={stopP}>
                    <button className="settings-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>⚙️</button>
                    {isMenuOpen && (
                        <div className="settings-menu">
                            <button className="menu-item" onClick={() => { onEditDayName(); setIsMenuOpen(false); }}>✏️ Edytuj nazwę</button>
                            <button className="menu-item delete" onClick={() => { if (window.confirm('Czy na pewno usunąć ten dzień?')) onRemoveDay(); setIsMenuOpen(false); }}>🗑️ Usuń dzień</button>
                        </div>
                    )}
                </div>
            )}
            <h2 className="card-title">{day.name}</h2>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleActivityDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
                <SortableContext items={day.actvs.map(a => a.id)} strategy={verticalListSortingStrategy}>
                    <div className="activity-list" onPointerDown={stopP} ref={listRef}>
                        {day.actvs.map(act => (
                            <ActivityRow
                                key={act.id}
                                act={act}
                                onUpdate={(f, v) => onUpdateActivity(act.id, f, v)}
                                onDelete={() => onDeleteActivity(act.id)}
                                onAddNext={onAddActivity}
                                stopP={stopP}
                                showTime={day.showTime !== false}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <button className="add-item-btn" onPointerDown={stopP} onClick={handleAddActivity}>+</button>
        </div>
    );
};

export default DayItem;
