import { useState } from 'react';
import type { PlanT, Day, PackList, StuffList, Actv, FinCategory, FinItem } from '../types';

export const useTravelPlans = () => {
    const [allPlans, setAllPlans] = useState<PlanT[]>(() => {
        const saved = localStorage.getItem('myTravelPlans');
        return saved ? JSON.parse(saved) : [];
    });

    const savePlans = (updatedPlans: PlanT[]) => {
        setAllPlans(updatedPlans);
        localStorage.setItem('myTravelPlans', JSON.stringify(updatedPlans));
    };

    const addPlan = (name: string, daysCount: number, peopleCount: number) => {
        const initialDays: Day[] = Array.from({ length: daysCount }, (_, index) => ({
            id: Date.now() + index,
            name: `Dzień ${index + 1}`,
            actvs: []
        }));

        const initialPacks: PackList[] = Array.from({ length: peopleCount }, (_, index) => ({
            id: Date.now() + index,
            name: `Osoba ${index + 1}`,
            stuff: []
        }));

        const newPlan: PlanT = {
            id: Date.now(),
            name: name,
            days: initialDays,
            packs: initialPacks,
            categories: []
        };
        savePlans([newPlan, ...allPlans]);
    };

    const removePlan = (id: number) => {
        savePlans(allPlans.filter(p => p.id !== id));
    };

    const renamePlan = (id: number, newName: string) => {
        savePlans(allPlans.map(p => p.id === id ? { ...p, name: newName } : p));
    };

    const updatePlan = (planName: string, updateFn: (plan: PlanT) => PlanT) => {
        const updated = allPlans.map(p => p.name === planName ? updateFn(p) : p);
        savePlans(updated);
    };

    // Przenumerowuje dni pasujące do wzorca "Dzień X" wg pozycji
    const renumberDays = (days: Day[]): Day[] =>
        days.map((d, i) => /^Dzień \d+$/.test(d.name) ? { ...d, name: `Dzień ${i + 1}` } : d);

    // Przenumerowuje osoby pasujące do wzorca "Osoba X" wg pozycji
    const renumberPacks = (packs: PackList[]): PackList[] =>
        packs.map((p, i) => /^Osoba \d+$/.test(p.name) ? { ...p, name: `Osoba ${i + 1}` } : p);

    // Day operations
    const addDay = (planName: string, dayName: string) => {
        updatePlan(planName, p => ({
            ...p,
            days: [...p.days, { id: Date.now(), name: dayName, actvs: [] }]
        }));
    };

    const removeDay = (planName: string, dayId: number) => {
        updatePlan(planName, p => ({
            ...p,
            days: renumberDays(p.days.filter(d => d.id !== dayId))
        }));
    };

    const editDayName = (planName: string, dayId: number, newName: string) => {
        updatePlan(planName, p => ({
            ...p,
            days: p.days.map(d => d.id === dayId ? { ...d, name: newName } : d)
        }));
    };

    const addActivity = (planName: string, dayId: number) => {
        updatePlan(planName, p => ({
            ...p,
            days: p.days.map(d => d.id === dayId ? { 
                ...d, 
                actvs: [...d.actvs, { id: Date.now(), activity: "", hour: "" }] 
            } : d)
        }));
    };

    const updateActivity = (planName: string, dayId: number, actId: number, field: keyof Actv, val: string) => {
        updatePlan(planName, p => ({
            ...p,
            days: p.days.map(d => d.id === dayId ? {
                ...d,
                actvs: d.actvs.map(a => a.id === actId ? { ...a, [field]: val } : a)
            } : d)
        }));
    };

    const removeActivity = (planName: string, dayId: number, actId: number) => {
        updatePlan(planName, p => ({
            ...p,
            days: p.days.map(d => d.id === dayId ? {
                ...d,
                actvs: d.actvs.filter(a => a.id !== actId)
            } : d)
        }));
    };

    // Packing operations
    const addPackList = (planName: string, name: string) => {
        updatePlan(planName, p => ({
            ...p,
            packs: [...p.packs, { id: Date.now(), name, stuff: [] }]
        }));
    };

    const removePackList = (planName: string, packId: number) => {
        updatePlan(planName, p => ({
            ...p,
            packs: renumberPacks(p.packs.filter(pk => pk.id !== packId))
        }));
    };

    const editPackListName = (planName: string, packId: number, newName: string) => {
        updatePlan(planName, p => ({
            ...p,
            packs: p.packs.map(pk => pk.id === packId ? { ...pk, name: newName } : pk)
        }));
    };

    const addStuff = (planName: string, packId: number) => {
        updatePlan(planName, p => ({
            ...p,
            packs: p.packs.map(pk => {
                if (pk.id !== packId) return pk;
                const newItem = { id: Date.now(), name: "", done: false };
                const firstDoneIdx = pk.stuff.findIndex(s => s.done);
                const newStuff = firstDoneIdx === -1
                    ? [...pk.stuff, newItem]
                    : [...pk.stuff.slice(0, firstDoneIdx), newItem, ...pk.stuff.slice(firstDoneIdx)];
                return { ...pk, stuff: newStuff };
            })
        }));
    };

    const updateStuff = (planName: string, packId: number, stuffId: number, val: string) => {
        updatePlan(planName, p => ({
            ...p,
            packs: p.packs.map(pk => pk.id === packId ? {
                ...pk,
                stuff: pk.stuff.map(s => s.id === stuffId ? { ...s, name: val } : s)
            } : pk)
        }));
    };

    const toggleStuffDone = (planName: string, packId: number, stuffId: number) => {
        updatePlan(planName, p => ({
            ...p,
            packs: p.packs.map(pk => {
                if (pk.id !== packId) return pk;
                const item = pk.stuff.find(s => s.id === stuffId)!;
                const newDone = !item.done;
                const toggled = { ...item, done: newDone };
                const rest = pk.stuff.filter(s => s.id !== stuffId);
                const undone = rest.filter(s => !s.done);
                const done = rest.filter(s => s.done);
                const newStuff = newDone
                    ? [...undone, ...done, toggled]   // zaznaczone → na sam dół
                    : [...undone, toggled, ...done];  // odznaczone → dół niespakowanych
                return { ...pk, stuff: newStuff };
            })
        }));
    };

    // Finanse
    const addCategory = (planName: string) => {
        updatePlan(planName, p => {
            const num = (p.categories || []).length + 1;
            const newCat: FinCategory = { id: Date.now(), name: `Kategoria ${num}`, items: [] };
            return { ...p, categories: [...(p.categories || []), newCat] };
        });
    };

    const addFinItem = (planName: string, catId: number) => {
        updatePlan(planName, p => ({
            ...p,
            categories: (p.categories || []).map(c => c.id === catId
                ? { ...c, items: [...(c.items || []), { id: Date.now(), name: '', amount: '' }] }
                : c)
        }));
    };

    const updateFinItem = (planName: string, catId: number, itemId: number, field: keyof FinItem, value: string) => {
        updatePlan(planName, p => ({
            ...p,
            categories: (p.categories || []).map(c => c.id === catId
                ? { ...c, items: (c.items || []).map(i => i.id === itemId ? { ...i, [field]: value } : i) }
                : c)
        }));
    };

    const removeFinItem = (planName: string, catId: number, itemId: number) => {
        updatePlan(planName, p => ({
            ...p,
            categories: (p.categories || []).map(c => c.id === catId
                ? { ...c, items: (c.items || []).filter(i => i.id !== itemId) }
                : c)
        }));
    };

    const renumberCategories = (cats: FinCategory[]): FinCategory[] => {
        let counter = 0;
        return cats.map(c => {
            counter++;
            return /^Kategoria \d+$/.test(c.name) ? { ...c, name: `Kategoria ${counter}` } : c;
        });
    };

    const removeCategory = (planName: string, catId: number) => {
        updatePlan(planName, p => ({
            ...p,
            categories: renumberCategories((p.categories || []).filter(c => c.id !== catId))
        }));
    };

    const renameCategory = (planName: string, catId: number, name: string) => {
        updatePlan(planName, p => ({
            ...p,
            categories: (p.categories || []).map(c => c.id === catId ? { ...c, name } : c)
        }));
    };

    const reorderStuff = (planName: string, packId: number, newStuff: StuffList[]) => {
        updatePlan(planName, p => ({
            ...p,
            packs: p.packs.map(pk => pk.id === packId ? { ...pk, stuff: newStuff } : pk)
        }));
    };

    const removeStuff = (planName: string, packId: number, stuffId: number) => {
        updatePlan(planName, p => ({
            ...p,
            packs: p.packs.map(pk => pk.id === packId ? {
                ...pk,
                stuff: pk.stuff.filter(s => s.id !== stuffId)
            } : pk)
        }));
    };

    const reorderDays = (planName: string, newDays: Day[]) => {
        updatePlan(planName, p => ({ ...p, days: renumberDays(newDays) }));
    };

    const toggleDayTime = (planName: string, dayId: number) => {
        updatePlan(planName, p => ({
            ...p,
            days: p.days.map(d => d.id === dayId ? { ...d, showTime: d.showTime === false } : d)
        }));
    };

    const reorderActivities = (planName: string, dayId: number, newActvs: Actv[]) => {
        updatePlan(planName, p => ({
            ...p,
            days: p.days.map(d => d.id === dayId ? { ...d, actvs: newActvs } : d)
        }));
    };

    const reorderPacks = (planName: string, newPacks: PackList[]) => {
        updatePlan(planName, p => ({ ...p, packs: renumberPacks(newPacks) }));
    };

    const reorderPlans = (newPlans: PlanT[]) => {
        savePlans(newPlans);
    };

    return {
        allPlans,
        addPlan,
        removePlan,
        renamePlan,
        reorderPlans,
        addDay,
        removeDay,
        editDayName,
        addActivity,
        updateActivity,
        removeActivity,
        reorderDays,
        toggleDayTime,
        reorderActivities,
        addPackList,
        removePackList,
        editPackListName,
        addStuff,
        updateStuff,
        toggleStuffDone,
        removeStuff,
        reorderPacks,
        reorderStuff,
        addCategory,
        removeCategory,
        renameCategory,
        addFinItem,
        updateFinItem,
        removeFinItem
    };
};
