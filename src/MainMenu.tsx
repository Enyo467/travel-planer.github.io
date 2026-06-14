import './App.css'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useTravelPlans } from './hooks/useTravelPlans';
import Modal from './components/Modal';
import { FlowerPanel } from './components/Flowers';
import SortablePlanItem from './components/SortablePlanItem';

function MainMenu() {
    const navigate = useNavigate();
    const { allPlans, addPlan, removePlan, renamePlan, reorderPlans } = useTravelPlans();

    const [isAddPlanOpen, setIsAddPlanOpen] = useState<boolean>(false);
    const [namePlanInput, setNamePlanInput] = useState<string>("");
    const [renameModal, setRenameModal] = useState<{ id: number, name: string } | null>(null);
    const [renameInput, setRenameInput] = useState("");
    const [numberOfDays, setNumberOfDays] = useState<number | null>(null);
    const [numberOfPeople, setNumberOfPeople] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );

    const handleAddPlan = () => {
        if (namePlanInput.trim() !== "") {
            addPlan(namePlanInput, numberOfDays || 0, numberOfPeople || 0);
            setNamePlanInput("");
            setIsAddPlanOpen(false);
            setNumberOfDays(null);
            setNumberOfPeople(null);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = allPlans.findIndex((item) => item.id === active.id);
            const newIndex = allPlans.findIndex((item) => item.id === over.id);
            reorderPlans(arrayMove(allPlans, oldIndex, newIndex));
        }
    };

    return (
        <div className="app-container">
            <FlowerPanel side="left" top={170} />
            <FlowerPanel side="right" top={170} />

            <div className="menu-header">
                <h1 className="menu-logo-title">TravelPlaner</h1>
                <div className="menu-wave">
                    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,0 H1200 V20 C1100,55 1000,10 900,35 C800,58 700,15 600,38 C500,58 400,12 300,36 C200,58 100,15 0,38 Z" fill="#FFECEE"/>
                    </svg>
                </div>
            </div>

            <div className="plans-grid">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={allPlans.map(p => p.id)} strategy={rectSortingStrategy}>
                        {allPlans.map((plan) => (
                            <SortablePlanItem
                                key={plan.id}
                                plan={plan}
                                onRemove={removePlan}
                                onRenameClick={(id, name) => { setRenameModal({ id, name }); setRenameInput(name); }}
                                onClick={() => navigate(`/plan/${plan.name}`)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                <div className="add-plan-btn" onClick={() => setIsAddPlanOpen(true)}>
                    +
                </div>
            </div>

            <Modal
                isOpen={!!renameModal}
                onClose={() => setRenameModal(null)}
                onSave={() => {
                    if (renameModal && renameInput.trim()) {
                        renamePlan(renameModal.id, renameInput.trim().slice(0, 20));
                    }
                    setRenameModal(null);
                }}
                title="Edytuj nazwę"
            >
                <input
                    className="form-input"
                    type="text"
                    value={renameInput}
                    onChange={(e) => setRenameInput(e.target.value)}
                    maxLength={20}
                    autoFocus
                    style={{ textAlign: 'center' }}
                />
            </Modal>

            <Modal
                isOpen={isAddPlanOpen}
                onClose={() => setIsAddPlanOpen(false)}
                onSave={handleAddPlan}
                title="Nowa Podróż"
            >
                <div className="form-group">
                    <label>Dokąd jedziesz?</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Nazwa wycieczki..."
                        value={namePlanInput}
                        onChange={(e) => setNamePlanInput(e.target.value)}
                        maxLength={20}
                        autoFocus
                        style={{ textAlign: 'center' }}
                    />
                </div>

                <div className="form-group">
                    <label>Ile dni?</label>
                    <input
                        className="form-input"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={numberOfDays || ""}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setNumberOfDays(val < 0 ? 0 : val || null);
                        }}
                        style={{ textAlign: 'center' }}
                    />
                </div>

                <div className="form-group">
                    <label>Ile osób?</label>
                    <input
                        className="form-input"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={numberOfPeople || ""}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setNumberOfPeople(val < 0 ? 0 : val || null);
                        }}
                        style={{ textAlign: 'center' }}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default MainMenu;
