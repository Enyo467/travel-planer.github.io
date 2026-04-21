import './App.css'
import './PDetStyle.css'
import './PackListStyle.css'
import {useState} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import type { PlanT, Day, PackList, StuffList, Actv } from './types';
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';

type TabType= 'plan' | 'finanse' | 'info' | 'pack';

function PlanDetails() {
    const navigate = useNavigate();
    const { planName } = useParams<{planName: string}>();
    const [activeTab, setActiveTab] = useState<TabType>('plan');
    const [isAddDayOpen, setIsAddDayOpen] = useState<boolean>(false);
    const [isEditDayOpen, setIsEditDayOpen] = useState<boolean>(false);
    const [dayToEditId, setDayToEditId] = useState<number | null>(null);

    const [allPlans, setAllPlans] = useState<PlanT[]>(() => {
        const saved = localStorage.getItem('myTravelPlans');
        return saved ? JSON.parse(saved) : [];
    });

    const currentPlan = allPlans.find(p => p.name === planName);

    if (!currentPlan) {
        return (
            <div className="error-screen">
                <h2>Nie znaleziono planu: {planName}</h2>
                <button onClick={() => navigate('/')}>Wróć do Menu</button>
            </div>
        );
    }

    const [nameDayInput, setNameDayInput] = useState<string>("");
    const [newNameDay, setNewNameDay] = useState<string>("");

    const [namePackInput, setNamePackInput] = useState<string>("");
    const [newPackName, setNewPackName] = useState<string>("");
    const [isAddPackOpen, setIsAddPackOpen] = useState<boolean>(false);
    const [isEditPackOpen, setIsEditPackOpen] = useState<boolean>(false);
    const [packToEditId, setPackToEditId] = useState<number | null>(null);


    const addDay = () => {
        if (nameDayInput.trim() === "") return;

        const newDay: Day = {
            id: Date.now(),
            name: nameDayInput,
            actvs: []
        };

        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                return { ...plan, days: [...plan.days, newDay] };
            }
            return plan;
        });

        setAllPlans(updatedPlans);
        localStorage.setItem('myTravelPlans', JSON.stringify(updatedPlans));

        setNameDayInput("");
        setIsAddDayOpen(false);
    };

    const stopAddDay = () => {
        setIsAddDayOpen(false);
        setNameDayInput("");
    }

    const removeDay = (dayToDelete: number) => {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedDays = plan.days.filter(day => day.id !== dayToDelete);
                return { ...plan, days: updatedDays };
            }
            return plan;
        });

        setAllPlans(updatedPlans);
        localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
    }

    const deleteActv = (dayId: number, activityIndex: number) => {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedDays = plan.days.map(day => {
                    if (day.id === dayId) {
                        const updatedActvs = day.actvs.filter(item => item.id !== activityIndex);
                        return { ...day, actvs: updatedActvs };
                    }
                    return day;
                });
                return { ...plan, days: updatedDays };
            }
            return plan;
        })
        setAllPlans(updatedPlans);
        localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
    }

    const editDay = (idToEdit: number, newName: string) => {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedDays = plan.days.map(day => {
                    if (day.id === idToEdit) {
                        return { ...day, name: newName };
                    }
                    return day;
                })
                return { ...plan, days: updatedDays };
            }
            return plan;
        })

        setAllPlans(updatedPlans);
        localStorage.setItem('myTravelPlans', JSON.stringify(updatedPlans));
        setIsEditDayOpen(false);
        setNewNameDay("");
    }

    const stopEditDay = () => {
        setIsEditDayOpen(false);
    }

    const addActivityField = (dayId: number) => {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedDays = plan.days.map(day => {
                    if (day.id === dayId) {
                        const newActv: Actv = {
                            id: Date.now(),
                            activity: "",
                            hour: ""
                        };

                        return {...day, actvs: [...day.actvs, newActv]}
                    }
                    return day;
                })
                return { ...plan, days: updatedDays };
            }
            return plan;
        })

        setAllPlans(updatedPlans);
        localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
    }

    const updateActivity = (dayId: number, activityIndex: number, newValue: string) => {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedDays = plan.days.map(day => {
                    if (day.id === dayId) {
                        const updatedActvs = day.actvs.map(item => {
                            if (item.id === activityIndex) {
                                return {...item, activity: newValue}
                            }
                            return item;
                        })
                        return {...day, actvs: updatedActvs};
                    }
                    return day;
                })
                return { ...plan, days: updatedDays };
            }
            return plan;
        })
        setAllPlans(updatedPlans);
        localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
    }

    const updateHour = (dayId: number, activityIndex: number, newValue: string) => {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedDays = plan.days.map(day => {
                    if (day.id === dayId) {
                        const updatedHours = day.actvs.map(item => {
                            if (item.id === activityIndex) {
                                return {...item, hour: newValue}
                            }
                            return item;
                        })
                        return {...day, actvs: updatedHours };
                    }
                    return day;
                })
                return { ...plan, days: updatedDays };
            }
            return plan;
        })

        setAllPlans(updatedPlans);
        localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
    }

    const updateStuff = (packId: number, stuffId: number, newValue: string)=> {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedPacks = plan.packs.map(pack => {
                    if (pack.id === packId) {
                        const updatedStuff = pack.stuff.map(stuff => {
                            if (stuff.id === stuffId) {
                                return { ...stuff, name: newValue}
                            }
                            return stuff;
                        })
                        return { ...pack, stuff: updatedStuff };
                    }
                    return pack;
                })
                return {...plan, packs: updatedPacks };
            }
            return plan;
        })
        setAllPlans(updatedPlans);
        localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
    }

    const stopAddPack = () => {
        setIsAddPackOpen(false);
        setNamePackInput("");
    }

    const addPack = () => {
        if (namePackInput.trim() === "") return;

        const newPack: PackList = {
            id: Date.now(),
            name: namePackInput,
            stuff: []
        };

        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                return { ...plan, packs: [...plan.packs, newPack] };
            }
            return plan;
        });

        setAllPlans(updatedPlans);
        localStorage.setItem('myTravelPlans', JSON.stringify(updatedPlans));

        setNamePackInput("");
        setIsAddPackOpen(false);
    }

    const removePack = (packToDelete: number) => {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedPacks = plan.packs.filter(pack => pack.id !== packToDelete);
                return { ...plan, packs: updatedPacks };
            }
            return plan;
        });

        setAllPlans(updatedPlans);
        localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
    }

    const stopEditPack = () => {
        setIsEditPackOpen(false);
    }

    const editPack = (packToEdit: number, newName: string) => {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedPacks = plan.packs.map(pack => {
                    if (pack.id === packToEdit) {
                        return { ...pack, name: newName };
                    }
                    return pack;
                })
                return { ...plan, packs: updatedPacks };
            }
            return plan;
        })
        setAllPlans(updatedPlans);
        localStorage.setItem('myTravelPlans', JSON.stringify(updatedPlans));
        setIsEditPackOpen(false);
        setNewPackName("");
    }

    const addStuffField = (packId: number) => {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedPacks = plan.packs.map(pack => {
                    if (pack.id === packId) {
                        const newStuff: StuffList = {
                            id: Date.now(),
                            name: "",
                            done: false
                        };

                        return {
                            ...pack,
                            stuff: [...pack.stuff, newStuff]
                        };
                    }
                    return pack;
                })
                return { ...plan, packs: updatedPacks };
            };
            return plan;
        })

        setAllPlans(updatedPlans);
        localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
    };

    const deleteStuff = (packId: number, stuffId: number) => {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedPacks = plan.packs.map(pack => {
                    if (pack.id === packId) {
                        const updatedStuff = pack.stuff.filter(item => item.id !== stuffId);
                        return { ...pack, stuff: updatedStuff };
                    }
                    return pack;
                })
                return { ...plan, packs: updatedPacks };
            }
            return plan;
        })
        setAllPlans(updatedPlans);
        localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
    }

    const changeDone = (packId: number, stuffId: number) => {
        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                const updatedPacks = plan.packs.map(pack => {
                    if (pack.id === packId) {
                        const updatedStuff = pack.stuff.map(stuff => {
                            if (stuff.id === stuffId) {
                                if(stuff.done === true) {
                                    return { ...stuff, done: false };
                                }
                                else {
                                    return { ...stuff, done: true };
                                }
                            }
                            return stuff;
                        } )
                        return { ...pack, stuff: updatedStuff };
                    }
                    return pack;
                })
                return { ...plan, packs: updatedPacks };
            }
            return plan;
        })
        setAllPlans(updatedPlans);
        localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const updatedPlans = allPlans.map(plan => {
                if (plan.name === planName) {
                    const oldIndex = plan.days.findIndex(d => d.id === active.id);
                    const newIndex = plan.days.findIndex(d => d.id === over.id);

                    return {
                        ...plan,
                        days: arrayMove(plan.days, oldIndex, newIndex)
                    };
                }
                return plan;
            });

            setAllPlans(updatedPlans);
            localStorage.setItem("myTravelPlans", JSON.stringify(updatedPlans));
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    return (
        <div className="planDetails">
            <div className="top">
                <h1 className="title">{planName}</h1>
                <button className="backToMM" onClick={() => navigate('/')}>Menu</button>
            </div>

            <div className="nav">
                <button
                    className={activeTab === 'plan' ? "navBtnActive" : "navBtn"}
                    onClick={() => setActiveTab('plan')}>
                    Plan Dnia
                </button>
                <button
                    className={activeTab === 'finanse' ? "navBtnActive" : "navBtn"}
                    onClick={() => setActiveTab('finanse')}>
                    Finanse
                </button>
                <button
                    className={activeTab === 'info' ? "navBtnActive" : "navBtn"}
                    onClick={() => setActiveTab('info')}>
                    Ważne Informacje
                </button>
                <button
                    className={activeTab === 'pack' ? "navBtnActive" : "navBtn"}
                    onClick={() => setActiveTab('pack')}>
                    Pakowanie
                </button>
            </div>

            <div className="tab" style={{maxHeight: '100vh'}}>
                {activeTab === 'plan' && (
                    <div className="days" style={{backgroundColor: '#FFECEB', display: 'flex', gap: '10px', overflowX: 'auto', alignItems: 'center', marginLeft: '30px', marginRight: '20px', width: '100vw', maxHeight:'100vh' }}>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <div className="newDays" style={{display: 'flex', flexDirection: 'row', gap: '20px', maxHeight:'100vh'}}>
                                <SortableContext items={currentPlan.days.map(d => d.id)} strategy={rectSortingStrategy}>
                                    {currentPlan.days.map((day) => (
                                        <SortableDay
                                            key={day.id}
                                            day={day}
                                            updateHour={updateHour}
                                            updateActivity={updateActivity}
                                            addActivityField={addActivityField}
                                            deleteActv={deleteActv}
                                            removeDay={removeDay}
                                            setDayToEditId={setDayToEditId}
                                            setNewNameDay={setNewNameDay}
                                            setIsEditDayOpen={setIsEditDayOpen}
                                        />
                                    ))}
                                </SortableContext>
                                <button className="addDayBtn" onClick={() => setIsAddDayOpen(true)}>
                                    +
                                </button>
                            </div>
                        </DndContext>
                    </div>
                )}
                {activeTab === 'finanse' && (
                    <div className="fin">

                    </div>
                )}
                {activeTab === 'info' && (
                    <h1>info</h1>
                )}
                {activeTab === 'pack' && (
                    <div className="packs" style={{backgroundColor: '#FFECEB', display: 'flex', gap: '10px', overflowX: 'auto', marginLeft: '30px', width: '100vw' }}>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <div className="newPacks" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px'}}>
                                <SortableContext items={currentPlan.packs.map(p => p.id)} strategy={rectSortingStrategy}>
                                    {currentPlan.packs.map((pack) => (
                                        <SortablePack
                                            key={pack.id}
                                            pack={pack}
                                            changeDone={changeDone}
                                            updateStuff={updateStuff}
                                            addStuffField={addStuffField}
                                            deleteStuff={deleteStuff}
                                            removePack={removePack}
                                            setPackToEditId={setPackToEditId}
                                            setNewPackName={setNewPackName}
                                            setIsEditPackOpen={setIsEditPackOpen}
                                        />
                                    ))}
                                </SortableContext>
                                <button className="addDayBtn" onClick={() => setIsAddPackOpen(true)}>
                                    +
                                </button>
                            </div>
                        </DndContext>
                    </div>
                )}
            </div>

            {isAddDayOpen && (
                <div className="addDayWindow">
                    <div className="addDayHeader">
                        <button className="closeBtn" onClick={stopAddDay}>X</button>

                        <input
                            type="text"
                            id="name"
                            placeholder="Nazwij dzień podróży..."
                            value={nameDayInput}
                            autoFocus
                            onChange={(e) => setNameDayInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                    addDay();
                                }
                            }}
                        />

                        <button className="saveBtn" onClick={addDay}>Save</button>
                    </div>
                </div>
            )}

            {isAddPackOpen && (
                <div className="addDayWindow">
                    <div className="addDayHeader">
                        <button className="closeBtn" onClick={stopAddPack}>X</button>

                        <input
                            type="text"
                            id="name"
                            placeholder="Nazwij listę pakowania..."
                            value={namePackInput}
                            autoFocus
                            onChange={(e) => setNamePackInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                    addPack();
                                }
                            }}
                        />

                        <button className="saveBtn" onClick={() => addPack()}>Save</button>
                    </div>
                </div>
            )}

            {isEditDayOpen && (
                <div className="addDayWindow">
                    <div className="addDayHeader">
                        <button className="closeBtn" onClick={stopEditDay}>X</button>

                        <input
                            type="text"
                            id="name"
                            placeholder="Nazwij dzień podróży..."
                            value={newNameDay}
                            autoFocus
                            onChange={(e) => setNewNameDay(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                    editDay(dayToEditId as number, newNameDay);
                                }
                            }}
                        />

                        <button className="saveBtn" onClick={() => editDay(dayToEditId as number, newNameDay)}>Save</button>
                    </div>
                </div>
            )}

            {isEditPackOpen && (
                <div className="addDayWindow">
                    <div className="addDayHeader">
                        <button className="closeBtn" onClick={stopEditPack}>X</button>

                        <input
                            type="text"
                            id="name"
                            placeholder="Nazwij dzień podróży..."
                            value={newPackName}
                            autoFocus
                            onChange={(e) => setNewPackName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                    editPack(packToEditId as number, newPackName);
                                }
                            }}
                        />

                        <button className="saveBtn" onClick={() => editPack(packToEditId as number, newPackName)}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function SortableDay ({day, updateHour, updateActivity, addActivityField, deleteActv, removeDay, setDayToEditId, setNewNameDay, setIsEditDayOpen } : any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: day.id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: isDragging ? 'none' : transition, //WAŻNE DZIĘKI TEMU PŁYNNIE SIE PRZESUWA KAFELEK
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
            className="dayWrapper"
            {...attributes}
            {...listeners}
        >
            <div className="nameDayCon">
                <h2 className="dayName">{day.name}</h2>
            </div>

            <div className="actvSpace">
                {day.actvs.map((item: Actv, index: number) => (
                    <div className="spaceWrapper" key={index}>
                        <input
                            className="hourInput"
                            type="time"
                            key={index}
                            value={item.hour}
                            onPointerDown={stopPropagation}
                            onChange={(e) => updateHour(day.id, item.id, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                }
                            }}
                        />
                        <input
                            className="actvInput"
                            type="text"
                            key={index}
                            value={item.activity}
                            autoFocus={index === day.actvs.length - 1 && item.activity === ""}
                            onPointerDown={stopPropagation}
                            onChange={(e) => updateActivity(day.id, item.id, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if(index === day.actvs.length - 1) {
                                        addActivityField(day.id)
                                    }
                                    else {
                                        const nextInput = (e.target as HTMLInputElement)
                                            .closest('.spaceWrapper')
                                            ?.nextElementSibling
                                            ?.querySelector('.actvInput') as HTMLInputElement;
                                        nextInput?.focus();
                                    }
                                }
                            }}
                        />

                        <button className="delActvBtn" onPointerDown={stopPropagation} onClick={() => deleteActv(day.id, item.id)}>🗑️</button>
                    </div>
                ))}

                <button className="addActivityBtn" onPointerDown={stopPropagation} onClick={() => addActivityField(day.id)}>+</button>
            </div>

            <button className="deleteBtn" onPointerDown={stopPropagation} onClick={(e) => {
                e.stopPropagation();
                removeDay(day.id);
            }}>X</button>

            <button className="editDayBtn" onPointerDown={stopPropagation} onClick={(e) => {
                e.stopPropagation();
                setDayToEditId(day.id);
                setNewNameDay(day.name);
                setIsEditDayOpen(true);
            }}>✏️</button>

        </div>
    );
}

function SortablePack ({pack, changeDone, updateStuff, addStuffField, deleteStuff, removePack, setPackToEditId, setNewPackName, setIsEditPackOpen} : any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: pack.id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: isDragging ? 'none' : transition, //WAŻNE DZIĘKI TEMU PŁYNNIE SIE PRZESUWA KAFELEK
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
            className="packWrapper"
            {...attributes}
            {...listeners}
        >
            <div className="namePackCon">
                <h2 className="packName">{pack.name}</h2>
            </div>

            <div className="mainPLSpace">
                {pack.stuff.map((stuff: StuffList, index: number) => (
                    <div className="plSpaceWrapper" key={stuff.id}>
                        <button className={ stuff.done === true ? "doneBtnActive" : "doneBtn"} onPointerDown={stopPropagation} onClick={() => changeDone(pack.id, stuff.id)}>o</button>
                        <input
                            className="plInput"
                            style={stuff.done === true ? {color: 'grey'} : {color: 'black'}}
                            type="text"
                            key={stuff.id}
                            value={stuff.name}
                            autoFocus
                            onPointerDown={stopPropagation}
                            onChange={(e) => updateStuff(pack.id, stuff.id, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if(index === pack.stuff.length - 1) {
                                        addStuffField(pack.id)
                                    }
                                    else {
                                        const nextInput = (e.target as HTMLInputElement)
                                            .closest('.plSpaceWrapper')
                                            ?.nextElementSibling
                                            ?.querySelector('.plInput') as HTMLInputElement;
                                        nextInput?.focus();
                                    }
                                }
                            }}
                        />
                        <button className="delActvBtn" onPointerDown={stopPropagation} onClick={() => deleteStuff(pack.id, stuff.id)}>🗑️</button>
                    </div>
                ))}
            </div>

            <button className="addActivityBtn" onPointerDown={stopPropagation} onClick={() => addStuffField(pack.id)}>+</button>

            <button className="deleteBtn" onPointerDown={stopPropagation} onClick={(e) => {
                e.stopPropagation();
                removePack(pack.id);
            }}>X</button>

            <button className="editDayBtn" onPointerDown={stopPropagation} onClick={() => {
                setPackToEditId(pack.id);
                setNewPackName(pack.name);
                setIsEditPackOpen(true);
            }}>✏️</button>
        </div>
    )
}

export default PlanDetails;