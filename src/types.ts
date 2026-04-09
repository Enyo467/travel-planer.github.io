export interface PlanT {
    id: number;
    name: string;
    days: Day[];
    packs: PackList[];
}

export interface Day {
    id: number;
    name: string;
    actvs: Actv[];
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