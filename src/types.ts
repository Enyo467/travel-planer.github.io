export interface PlanT {
    id: number;
    name: string;
    days: Day[];
    packs: PackList[];
}

export interface Day {
    id: number;
    name: string;
    activities: string[]; /*zmienić na oddzielny obiekt z aktynością i godzinami, REFAKTORYZACJA KODU*/
    hours: string[];
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