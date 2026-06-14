export interface FinItem {
    id: number;
    name: string;
    amount: string;
}

export interface FinCategory {
    id: number;
    name: string;
    items: FinItem[];
}

export interface PlanT {
    id: number;
    name: string;
    days: Day[];
    packs: PackList[];
    categories: FinCategory[];
}

export interface Day {
    id: number;
    name: string;
    actvs: Actv[];
    showTime?: boolean;
}

export interface Actv {
    id: number;
    activity: string;
    hour: string;
}

export interface PackList {
    id: number;
    name: string;
    stuff: StuffList[];
}

export interface StuffList {
    id: number;
    name: string;
    done: boolean;
}