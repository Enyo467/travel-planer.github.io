import React, { useState, useRef, useEffect } from 'react';
import type { FinCategory, FinItem } from '../types';
import '../PDetStyle.css';
import './FinanseCard.css';

interface FinanseCardProps {
    categories: FinCategory[];
    onAddCategory: () => void;
    onRemoveCategory: (id: number) => void;
    onRenameCategory: (id: number, name: string) => void;
    onAddItem: (catId: number) => void;
    onUpdateItem: (catId: number, itemId: number, field: keyof FinItem, value: string) => void;
    onRemoveItem: (catId: number, itemId: number) => void;
}

const FinanseCard: React.FC<FinanseCardProps> = ({
    categories, onAddCategory, onRemoveCategory, onRenameCategory,
    onAddItem, onUpdateItem, onRemoveItem
}) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Flagi do auto-focus po dodaniu
    const [focusNewCategory, setFocusNewCategory] = useState(false);
    const [focusItemCatId, setFocusItemCatId] = useState<number | null>(null);

    const startEdit = (cat: FinCategory) => {
        setEditingId(cat.id);
        setEditValue(cat.name);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const commitEdit = () => {
        if (editingId !== null && editValue.trim()) {
            onRenameCategory(editingId, editValue.trim());
        }
        setEditingId(null);
    };

    // Po dodaniu nowej kategorii — wejdź od razu w tryb edycji jej nazwy
    useEffect(() => {
        if (focusNewCategory && categories.length > 0) {
            startEdit(categories[categories.length - 1]);
            setFocusNewCategory(false);
        }
    }, [categories, focusNewCategory]);

    // Po dodaniu nowego itemu — focus na jego polu nazwy
    useEffect(() => {
        if (focusItemCatId !== null && containerRef.current) {
            const inputs = containerRef.current.querySelectorAll<HTMLInputElement>(
                `[data-cat-id="${focusItemCatId}"]`
            );
            if (inputs.length > 0) {
                inputs[inputs.length - 1].focus();
                setFocusItemCatId(null);
            }
        }
    }, [categories, focusItemCatId]);

    const handleAddCategory = () => {
        onAddCategory();
        setFocusNewCategory(true);
    };

    const handleAddItem = (catId: number) => {
        onAddItem(catId);
        setFocusItemCatId(catId);
    };

    return (
        <div className="detail-card detail-card--auto" ref={containerRef}>
            {/* Przycisk "+" dodawania kategorii - prawy górny róg */}
            <button className="fin-add-btn" style={{ position: 'absolute', top: 30, right: 15 }} onClick={handleAddCategory}>+</button>

            <h2 className="card-title card-title--center">Finanse</h2>

            <div className="activity-list">
                {categories.map(cat => (
                    <React.Fragment key={cat.id}>
                        {/* Wiersz kategorii: [🗑️] [nazwa] [+] */}
                        <div className="activity-item fin-category-row" style={{ position: 'relative' }}>
                            <button className="icon-btn fin-cat-trash" onClick={() => onRemoveCategory(cat.id)}>🗑️</button>

                            {editingId === cat.id ? (
                                <input
                                    ref={inputRef}
                                    className="fin-category-input"
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    onBlur={commitEdit}
                                    onKeyDown={e => { if (e.key === 'Enter') commitEdit(); }}
                                />
                            ) : (
                                <span className="fin-category-name" onDoubleClick={() => startEdit(cat)}>
                                    {cat.name}
                                </span>
                            )}

                            <button className="fin-row-add-btn" onClick={() => handleAddItem(cat.id)}>+</button>
                        </div>

                        {/* Sub-itemy: [nazwa] [kwota] */}
                        {(cat.items || []).map(item => (
                            <div key={item.id} className="activity-item fin-item-row">
                                <input
                                    className="fin-item-name"
                                    data-cat-id={cat.id}
                                    placeholder="nazwa..."
                                    value={item.name}
                                    onChange={e => onUpdateItem(cat.id, item.id, 'name', e.target.value)}
                                />
                                <input
                                    className="fin-item-amount"
                                    placeholder="0 zł"
                                    value={item.amount}
                                    onChange={e => onUpdateItem(cat.id, item.id, 'amount', e.target.value)}
                                />
                                <button className="icon-btn" style={{ position: 'static' }} onClick={() => onRemoveItem(cat.id, item.id)}>🗑️</button>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default FinanseCard;
