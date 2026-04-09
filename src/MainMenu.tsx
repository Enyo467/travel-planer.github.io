import './App.css'
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import type { PlanT } from './types.ts';

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

    const addPlan = () => {
        if (namePlanInput.trim() !== "") {
            const newPlan: PlanT = {
                id: Date.now(),
                name: namePlanInput,
                days: [],
                packs: []
            };

            const newPlans = [...addedPlans, newPlan];
            setAddedPlans(newPlans);
            localStorage.setItem("myTravelPlans", JSON.stringify(newPlans));

            setNamePlanInput("");
            setIsAddPlanOpen(false);
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

    return (
        <div className="app">
            <div className="title">
                <h1>Travel Planner</h1>
            </div>

            <div className="plans">
                <div className="newPlans" >
                    {[...addedPlans].reverse().map((plan) => (
                        <div key={plan.id} className="planWrapper" style={{position: 'relative'}}>
                            <button className="addedPlan" onClick={() => planClick(plan.name)}>{plan.name}</button>

                            <button className="deleteBtn" onClick={(e) => {
                                e.stopPropagation();
                                removePlan(plan.id);
                            }}>X</button>

                            <button className="editDayBtn" onClick={() => {
                                setPlanToEditId(plan.id);
                                setNewNamePlan(plan.name);
                                setIsEditPlanOpen(true);
                            }}>✏️</button>


                        </div>
                    ))}
                    <button className="addPlanBtn" onClick={() => setIsAddPlanOpen(true)}>
                        +
                    </button>
                </div>


            </div>

            {isAddPlanOpen && (
                <div className="addPlanWindow">
                    <div className="nameAPW">
                        <button className="closeBtn" onClick={stopAddPlan}>X</button>

                        <input
                            type="text"
                            id="name"
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

                        <button className="saveBtn" onClick={addPlan}>Save</button>

                    </div>
                </div>
            )}

            {isEditPlanOpen && (
                <div className="addPlanWindow">
                    <div className="nameAPW">
                        <button className="closeBtn" onClick= {() => setIsEditPlanOpen(false)}>X</button>

                        <input
                            type="text"
                            id="name"
                            placeholder="Nazwij swoją podróż..."
                            value={newNamePlan}
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

export default MainMenu;
