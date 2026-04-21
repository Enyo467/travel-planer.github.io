import './App.css'
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import type { PlanT, Day, PackList } from './types.ts';
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';

function MainMenu() {

    const navigate = useNavigate();
    const [isAddPlanOpen, setIsAddPlanOpen] = useState<boolean>(false);
    const [addedPlans, setAddedPlans] = useState<PlanT[]>(() => {
        const saved = localStorage.getItem('myTravelPlans');
        return saved ? JSON.parse(saved) : [];
    });
    const [namePlanInput, setNamePlanInput] = useState<string>("");
    const [planToEditId, setPlanToEditId] = useState<number | null>(null);
    const [newNamePlan, setNewNamePlan] = useState<string>("");
    const [isEditPlanOpen, setIsEditPlanOpen] = useState<boolean>(false);
    const [numberOfDays, setNumberOfDays] = useState<number | null>(null);
    const [numberOfPeople, setNumberOfPeople] = useState<number | null>(null);

    const addPlan = () => {
        if (namePlanInput.trim() !== "") {
            if (numberOfPeople === null) {
                setNumberOfPeople(0);
            }

            if (numberOfDays === null) {
                setNumberOfDays(0);
            }

            const initialDays: Day = Array.from({length: numberOfDays}, (_, index) => ({
                id: Date.now() + index,
                name: `Dzień ${index + 1}`,
                actvs: []
            }));

            const initialPacks: PackList = Array.from({length: numberOfPeople}, (_, index) => ({
                id: Date.now() + index,
                name: `Osoba ${index + 1}`,
                stuff: []
            }));

            const newPlan: PlanT = {
                id: Date.now(),
                name: namePlanInput,
                days: initialDays,
                packs: initialPacks
            };
            const newPlans = [newPlan, ...addedPlans];
            setAddedPlans(newPlans);
            localStorage.setItem("myTravelPlans", JSON.stringify(newPlans));

            setNamePlanInput("");
            setIsAddPlanOpen(false);
            setNumberOfDays(null);
            setNumberOfPeople(null);
        }
    }

    const removePlan = (idToDelete: number) => {
        const updatedPlans = addedPlans.filter(plan => plan.id !== idToDelete);
        setAddedPlans(updatedPlans);
        localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
    }

    const stopAddPlan = () => {
        setIsAddPlanOpen(false);
        setNamePlanInput("");
    }

    const planClick = (name: string) => {
        navigate(`/plan/${name}`);
    }

    const editPlan = (idToEdit: number, newName: string) => {
        const updatedPlans = addedPlans.map(plan => {
            if (plan.id === idToEdit) {
                return { ...plan, name: newName };
            }
            return plan;
        })

        setAddedPlans(updatedPlans);
        localStorage.setItem('myTravelPlans', JSON.stringify(updatedPlans));
        setIsEditPlanOpen(false);
        setNewNamePlan("");
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setAddedPlans((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newArray = arrayMove(items, oldIndex, newIndex);
                localStorage.setItem("myTravelPlans", JSON.stringify(newArray));
                return newArray;
            });
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, // Musisz przesunąć myszkę o 8px, żeby zaczęło się przeciąganie. Zwykłe kliknięcie przejdzie jako onClick!
            },
        })
    );

    return (
        <div className="app">
            <div className="title">
                <h1>Travel Planner</h1>
            </div>

            <div className="plans">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="newPlans" >
                        <button className="addPlanBtn" onClick={() => setIsAddPlanOpen(true)}>
                            +
                        </button>
                        <SortableContext items={addedPlans} strategy={rectSortingStrategy}>
                            {addedPlans.map((plan) => (
                                <SortablePlan
                                    key={plan.id}
                                    plan={plan}
                                    planClick={planClick}
                                    removePlan={removePlan}
                                    setPlanToEditId={setPlanToEditId}
                                    setNewNamePlan={setNewNamePlan}
                                    setIsEditPlanOpen={setIsEditPlanOpen}
                                />
                            ))}
                        </SortableContext>

                    </div>
                </DndContext>
            </div>

            {isAddPlanOpen && (
                <div className="addPlanWindow">
                    <div className="nameAPW">
                        <button className="closeBtn" onClick={stopAddPlan}>X</button>

                        <text className="text">Nazwij swoją podróż:</text>

                        <input
                            type="text"
                            id="name"
                            className="namePlanInput"
                            placeholder="Nazwij swoją podróż..."
                            value={namePlanInput}
                            autoFocus
                            onChange={(e) => setNamePlanInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                    addPlan();
                                }
                            }}
                        />

                        <div className="inputy">
                            <text className="text">Ilość dni:</text>
                            <input
                                type="number"
                                min="0"
                                className="numberInput"
                                onChange={(e) => setNumberOfDays(e.target.value)}
                            />
                        </div>

                        <div className="inputy">
                            <text className="text">Ilość osób:</text>
                            <input
                                type="number"
                                min="0"
                                className="numberInput"
                                onChange={(e) => setNumberOfPeople(e.target.value)}
                            />
                        </div>


                        <button className="saveBtn" style={{marginTop: '10px'}} onClick={addPlan}>Save</button>

                    </div>
                </div>
            )}

            {isEditPlanOpen && (
                <div className="addPlanWindow">
                    <div className="nameAPW">
                        <button className="closeBtn" onClick= {() => setIsEditPlanOpen(false)}>X</button>

                        <text className="text">Edytuj nazwę podróży:</text>

                        <input
                            type="text"
                            id="name"
                            placeholder="Nazwij swoją podróż..."
                            value={newNamePlan}
                            className="namePlanInput"
                            autoFocus
                            onChange={(e) => setNewNamePlan(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                    editPlan(planToEditId as number, newNamePlan);
                                }
                            }}
                        />

                        <button className="saveBtn" onClick={() => editPlan(planToEditId as number, newNamePlan)}>Save</button>

                    </div>
                </div>
            )}

        </div>
    );
}

function SortablePlan({ plan, planClick, removePlan, setPlanToEditId, setNewNamePlan, setIsEditPlanOpen }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: plan.id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: isDragging ? 'none' : transition,
        zIndex: isDragging ? 1000 : 1, // Aby kafelek był nad innymi podczas ciągnięcia
        opacity: isDragging ? 0.75 : 1,
        position: 'relative' as const,
        touchAction: 'none',
    };

    const stopPropagation = (e: React.PointerEvent | React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="planWrapper"
            {...attributes}
            {...listeners} // listeners sprawiają, że można "chwycić" kafelek
        >
            <button className="addedPlan" onClick={() => planClick(plan.name)}>
                {plan.name}
            </button>

            <button className="deleteBtn" onPointerDown={stopPropagation} onClick={(e) => {
                e.stopPropagation();
                removePlan(plan.id);
            }}>X</button>

            <button className="editDayBtn" onPointerDown={stopPropagation} onClick={(e) => {
                e.stopPropagation();
                setPlanToEditId(plan.id);
                setNewNamePlan(plan.name);
                setIsEditPlanOpen(true);
            }}>✏️</button>
        </div>
    );
}

export default MainMenu;
