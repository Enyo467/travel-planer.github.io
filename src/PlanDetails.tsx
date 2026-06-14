import './App.css'
import './PDetStyle.css'
import { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement, restrictToWindowEdges, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { useTravelPlans } from './hooks/useTravelPlans';
import CloudTabs from './components/CloudTabs';
import type { TabType } from './components/CloudTabs';
import Modal from './components/Modal';
import DayItem from './components/DayItem';
import PackItem from './components/PackItem';
import MiniDayCard from './components/MiniDayCard';
import MiniPackCard from './components/MiniPackCard';
import { FlowerPanel } from './components/Flowers';
import FinanseCard from './components/FinanseCard';
import SumaCard from './components/SumaCard';

function PlanDetails() {
    const navigate = useNavigate();
    const { planName } = useParams<{ planName: string }>();
    const { 
        allPlans, addDay, removeDay, editDayName, addActivity, updateActivity, removeActivity, reorderDays, reorderActivities, toggleDayTime,
        addPackList, removePackList, editPackListName, addStuff, updateStuff, toggleStuffDone, removeStuff, reorderPacks, reorderStuff,
        addCategory, removeCategory, renameCategory, addFinItem, updateFinItem, removeFinItem
    } = useTravelPlans();

    const [activeTab, setActiveTab] = useState<TabType>('plan');
    const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
    const [selectedPackId, setSelectedPackId] = useState<number | null>(null);
    const [modalConfig, setModalConfig] = useState<{ type: 'addDay' | 'editDay' | 'addPack' | 'editPack' | null, id?: number }>({ type: null });
    const [modalInput, setModalInput] = useState("");
    const [modalPlaceholder, setModalPlaceholder] = useState("");

    const currentPlan = allPlans.find(p => p.name === planName);

    if (!currentPlan || !planName) {
        return (
            <div className="app-container">
                <h2>Nie znaleziono planu: {planName}</h2>
                <button className="back-btn" onClick={() => navigate('/')}>Wróć do Menu</button>
            </div>
        );
    }

    const openModal = (type: 'addDay' | 'editDay' | 'addPack' | 'editPack', id?: number, initialValue = "", placeholder = "") => {
        setModalConfig({ type, id });
        setModalInput(initialValue);
        setModalPlaceholder(placeholder);
    };

    const closeModal = () => { setModalConfig({ type: null }); setModalPlaceholder(""); };

    const handleModalSave = () => {
        const value = modalInput.trim() || modalPlaceholder;
        if (!value) return;

        switch (modalConfig.type) {
            case 'addDay': addDay(planName, value); break;
            case 'editDay': editDayName(planName, modalConfig.id!, value); break;
            case 'addPack': addPackList(planName, value); break;
            case 'editPack': editPackListName(planName, modalConfig.id!, value); break;
        }
        closeModal();
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        if (activeTab === 'pack') {
            const oldIndex = currentPlan.packs.findIndex(p => p.id === active.id);
            const newIndex = currentPlan.packs.findIndex(p => p.id === over.id);
            reorderPacks(planName, arrayMove(currentPlan.packs, oldIndex, newIndex));
        }
    };

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

    return (
        <div className="plan-details-container">
            <FlowerPanel side="left" top={130} />
            <FlowerPanel side="right" top={130} />

            <header className="details-header">
                <button className="back-btn" onClick={() => navigate('/')}>← Menu</button>
                <CloudTabs activeTab={activeTab} onTabChange={setActiveTab} />
                <h1 className="title plan-title-badge">{planName}</h1>
            </header>
            <div className="drip-divider">
                <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,0 H1200 V20 C1100,55 1000,10 900,35 C800,58 700,15 600,38 C500,58 400,12 300,36 C200,58 100,15 0,38 Z" fill="#FFECEE"/>
                </svg>
            </div>

            <main className="tab-content">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToParentElement, restrictToWindowEdges]}>
                    {activeTab === 'plan' && (
                        <div className="plan-tab-layout">
                            {/* Lewa kolumna — mini karteczki */}
                            <div className="mini-days-panel">
                                <button
                                    className="add-plan-btn mini-add-btn"
                                    onClick={() => openModal('addDay', undefined, '', `Dzień ${currentPlan.days.length + 1}`)}
                                >+</button>
                                <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={(event) => {
                                    const { active, over } = event;
                                    if (!over || active.id === over.id) return;
                                    const oldIndex = currentPlan.days.findIndex(d => d.id === active.id);
                                    const newIndex = currentPlan.days.findIndex(d => d.id === over.id);
                                    reorderDays(planName, arrayMove(currentPlan.days, oldIndex, newIndex));
                                }}>
                                <SortableContext items={currentPlan.days.map(d => d.id)} strategy={verticalListSortingStrategy}>
                                {currentPlan.days.map(day => (
                                    <MiniDayCard
                                        key={day.id}
                                        day={day}
                                        isSelected={selectedDayId === day.id}
                                        onSelect={() => setSelectedDayId(day.id)}
                                        onEditName={() => openModal('editDay', day.id, day.name)}
                                        onRemove={() => removeDay(planName, day.id)}
                                        onToggleTime={() => toggleDayTime(planName, day.id)}
                                    />
                                ))}
                                </SortableContext>
                                </DndContext>
                            </div>

                            {/* Prawa strona — wybrana karteczka */}
                            <div className="day-detail-panel">
                                {selectedDayId && currentPlan.days.find(d => d.id === selectedDayId) ? (
                                    <DayItem
                                        key={selectedDayId}
                                        day={currentPlan.days.find(d => d.id === selectedDayId)!}
                                        onUpdateActivity={(aid, f, v) => updateActivity(planName, selectedDayId, aid, f, v)}
                                        onAddActivity={() => addActivity(planName, selectedDayId)}
                                        onDeleteActivity={(aid) => removeActivity(planName, selectedDayId, aid)}
                                        onRemoveDay={() => { removeDay(planName, selectedDayId); setSelectedDayId(null); }}
                                        onEditDayName={() => openModal('editDay', selectedDayId, currentPlan.days.find(d => d.id === selectedDayId)!.name)}
                                        onReorderActivities={(newActvs) => reorderActivities(planName, selectedDayId, newActvs)}
                                        hideSettings
                                    />
                                ) : (
                                    <div className="day-detail-empty">← Wybierz dzień</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'pack' && (
                        <div className="plan-tab-layout">
                            {/* Lewa kolumna — mini karty pakowania */}
                            <div className="mini-days-panel">
                                <button
                                    className="add-plan-btn mini-add-btn"
                                    onClick={() => openModal('addPack', undefined, '', `Osoba ${currentPlan.packs.length + 1}`)}
                                >+</button>
                                <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={(event) => {
                                    const { active, over } = event;
                                    if (!over || active.id === over.id) return;
                                    const oldIndex = currentPlan.packs.findIndex(p => p.id === active.id);
                                    const newIndex = currentPlan.packs.findIndex(p => p.id === over.id);
                                    reorderPacks(planName, arrayMove(currentPlan.packs, oldIndex, newIndex));
                                }}>
                                    <SortableContext items={currentPlan.packs.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                        {currentPlan.packs.map(pack => (
                                            <MiniPackCard
                                                key={pack.id}
                                                pack={pack}
                                                isSelected={selectedPackId === pack.id}
                                                onSelect={() => setSelectedPackId(pack.id)}
                                                onEditName={() => openModal('editPack', pack.id, pack.name)}
                                                onRemove={() => removePackList(planName, pack.id)}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            </div>

                            {/* Prawa strona — wybrana lista pakowania */}
                            <div className="day-detail-panel">
                                {selectedPackId && currentPlan.packs.find(p => p.id === selectedPackId) ? (
                                    <PackItem
                                        key={selectedPackId}
                                        pack={currentPlan.packs.find(p => p.id === selectedPackId)!}
                                        onChangeDone={(sid) => toggleStuffDone(planName, selectedPackId, sid)}
                                        onUpdateStuff={(sid, v) => updateStuff(planName, selectedPackId, sid, v)}
                                        onAddStuff={() => addStuff(planName, selectedPackId)}
                                        onDeleteStuff={(sid) => removeStuff(planName, selectedPackId, sid)}
                                        onRemovePack={() => { removePackList(planName, selectedPackId); setSelectedPackId(null); }}
                                        onEditPackName={() => openModal('editPack', selectedPackId, currentPlan.packs.find(p => p.id === selectedPackId)!.name)}
                                        onReorderStuff={(newStuff) => reorderStuff(planName, selectedPackId, newStuff)}
                                        hideSettings
                                    />
                                ) : (
                                    <div className="day-detail-empty">← Wybierz listę</div>
                                )}
                            </div>
                        </div>
                    )}
                </DndContext>

                {activeTab === 'finanse' && (
                    <div className="plan-tab-layout" style={{ gap: 160 }}>
                        <div className="day-detail-panel">
                            <FinanseCard
                                categories={currentPlan.categories || []}
                                onAddCategory={() => addCategory(planName)}
                                onRemoveCategory={(id) => removeCategory(planName, id)}
                                onRenameCategory={(id, name) => renameCategory(planName, id, name)}
                                onAddItem={(catId) => addFinItem(planName, catId)}
                                onUpdateItem={(catId, itemId, field, value) => updateFinItem(planName, catId, itemId, field, value)}
                                onRemoveItem={(catId, itemId) => removeFinItem(planName, catId, itemId)}
                            />
                        </div>
                        <div className="day-detail-panel">
                            <SumaCard categories={currentPlan.categories || []} />
                        </div>
                    </div>
                )}
            </main>

            <Modal 
                isOpen={!!modalConfig.type} 
                onClose={closeModal} 
                onSave={handleModalSave}
                title={modalConfig.type?.includes('edit') ? 'Edytuj nazwę' : 'Dodaj nową'}
            >
                <input
                    className="form-input"
                    type="text"
                    value={modalInput}
                    placeholder={modalPlaceholder}
                    onChange={(e) => setModalInput(e.target.value)}
                    autoFocus
                    style={{ textAlign: 'center' }}
                />
            </Modal>
        </div>
    );
}

export default PlanDetails;
