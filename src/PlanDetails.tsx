import './App.css'
import './PDetStyle.css'
import './PackListStyle.css'
import {useState} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import type { PlanT, Day, PackList, StuffList } from './types';

type TabType= 'plan' | 'finanse' | 'info' | 'pack';

function PlanDetails() {
    const navigate = useNavigate();
    const { planName } = useParams<{planName: string}>();
    const [activeTab, setActiveTab] = useState<TabType>('plan');
    const [isAddDayOpen, setIsAddDayOpen] = useState<boolean>(false);
    const [isEditDayOpen, setIsEditDayOpen] = useState<boolean>(false);
    const [planToEditId, setPlanToEditId] = useState<number | null>(null);

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
    /*const [newPackName, setNewPackName] = useState<string>("");*/
    const [isAddPackOpen, setIsAddPackOpen] = useState<boolean>(false);
    /*const [isEditPackOpen, setIsEditPackOpen] = useState<boolean>(false);*/
    /*const [isDone, setIsDone] = useState<boolean>(false);*/


    const addDay = () => {
        if (nameDayInput.trim() === "") return;

        const newDay: Day = {
            id: Date.now(),
            name: nameDayInput,
            activities: [],
            hours: []
        };

        const updatedPlans = allPlans.map(plan => {
            if (plan.name === planName) {
                return { ...plan, days: [...plan.days, newDay] };
            }
            return plan;
        });

        setAllPlans(updatedPlans); // Aktualizujemy główny stan
        localStorage.setItem('myTravelPlans', JSON.stringify(updatedPlans)); // Zapisujemy wszystko

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
                        const updatedActv = day.activities.filter((_, index) => index !== activityIndex);
                        const updatedHour = day.hours.filter((_, index) => index !== activityIndex);
                        return { ...day,
                            activities: updatedActv,
                            hours: updatedHour};
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
                        return {...day,
                            activities: [...day.activities, ""],
                            hours: [...day.hours, ""]};
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
                        const newActivities = [...day.activities];
                        newActivities[activityIndex] = newValue;
                        return { ...day, activities: newActivities };
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
                        const newHours = [...day.hours];
                        newHours[activityIndex] = newValue;
                        return {...day, hours: newHours };
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
                            stuff: [...pack.stuff, newStuff] // Dodajemy obiekt do tablicy
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

    /*const changeDone = (packId: number, stuffId: number) => {
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
    }*/

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

            <div className="tab">
                {activeTab === 'plan' && (
                    <div className="days" style={{backgroundColor: '#FFECEB', display: 'flex', gap: '10px', overflowX: 'auto', alignItems: 'center', marginLeft: '30px', marginRight: '20px', width: '100vw' }}>
                        <div className="newDays" style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
                            {currentPlan.days.map((day) => (
                                <div key={day.id} className="dayWrapper" style={{position: 'relative'}}>
                                    <div className="nameDayCon">
                                        <h2 className="dayName">{day.name}</h2>
                                    </div>

                                    <div className="actvSpace">
                                        {day.activities.map((text, index) => (
                                            <div className="spaceWrapper" key={index}>
                                                <input
                                                    className="hourInput"
                                                    type="text"
                                                    key={index}
                                                    value={day.hours[index]}
                                                    onChange={(e) => updateHour(day.id, index, e.target.value)}
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
                                                    value={text}
                                                    autoFocus={index === day.activities.length - 1 && text === ""}
                                                    onChange={(e) => updateActivity(day.id, index, e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            if(index === day.activities.length - 1) {
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

                                                <button className="delActvBtn" onClick={() => deleteActv(day.id, index)}>🗑️</button>
                                            </div>
                                        ))}

                                        <button className="addActivityBtn" onClick={() => addActivityField(day.id)}>+</button>
                                    </div>

                                    <button className="deleteDayBtn" onClick={(e) => {
                                        e.stopPropagation();
                                        removeDay(day.id);
                                    }}>X</button>

                                    <button className="editDayBtn" onClick={() => {
                                        setPlanToEditId(day.id);
                                        setNewNameDay(day.name);
                                        setIsEditDayOpen(true);
                                    }}>✏️</button>

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
                                                            editDay(planToEditId as number, newNameDay);
                                                        }
                                                    }}
                                                />

                                                <button className="saveBtnAPW" onClick={() => editDay(planToEditId as number, newNameDay)}>Save</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button className="addDayBtn" onClick={() => setIsAddDayOpen(true)}>
                            +
                        </button>

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
                        <div className="newPacks" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px'}}>
                            {currentPlan.packs.map((pack) => (
                                <div key={pack.id} className="packWrapper" style={{position: 'relative'}}>
                                    <div className="namePackCon">
                                        <h2 className="packName">{pack.name}</h2>
                                    </div>

                                    <div className="mainPLSpace">
                                        {pack.stuff.map((stuff) => (
                                            <div className="plSpaceWrapper" key={stuff.id}>
                                                <button className={ stuff.done === true ? "doneBtnActive" : "doneBtn"}>o</button>
                                                <input
                                                    className="plInput"
                                                    type="text"
                                                    key={stuff.id}
                                                    value={stuff.name}
                                                    onChange={(e) => updateStuff(pack.id, stuff.id, e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            (e.target as HTMLInputElement).blur();
                                                        }
                                                    }}
                                                />
                                                <button className="delActvBtn" /*onClick={() => deleteStuff(pack.id, index)}*/>🗑️</button>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="addActivityBtn" onClick={() => addStuffField(pack.id)}>+</button>

                                    <button className="deleteDayBtn" onClick={(e) => {
                                        e.stopPropagation();
                                        removePack(pack.id);
                                    }}>X</button>

                                </div>
                            ))}
                        </div>

                        <button className="addDayBtn" onClick={() => setIsAddPackOpen(true)}>
                            +
                        </button>

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

                        <button className="saveBtnAPW" onClick={addDay}>Save</button>
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

                        <button className="saveBtnAPW" onClick={() => addPack()}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlanDetails;