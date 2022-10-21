import { repeatPeriodUnit } from "@prisma/client";

export type TAddEventData = {
    beginning: string;
    ending?: string;
    title: string;
    isPeriodical: boolean;
    description?: string;
    place?: string;
    repeatPeriod?: number;
    repeatPeriodUnit?: repeatPeriodUnit;
    numberOfRepeatsBoundary?: number;
    dateBoundary?: string;
};

export type TEditEventData = {
    beginning?: string;
    ending?: string;
    title?: string;
    isPeriodical?: boolean;
    description?: string;
    place?: string;
    repeatPeriod?: number;
    repeatPeriodUnit?: repeatPeriodUnit;
    numberOfRepeatsBoundary?: number;
    dateBoundary?: string;
};

export type TEventResponse = {
    id: string;
    beginning: Date;
    ending: Date | null;
    title: string;
    description: string | null;
    place: string | null;
};

export type TEventQueryOutput = {
    id: string;
    beginTime: Date;
    endTime: Date | null;
    title: string;
    isPeriodical: boolean;
    description: string | null;
    place: string | null;
    repeatPeriod: number | null;
    repeatPeriodUnit: repeatPeriodUnit | null;
    dateBoundary: Date | null;
};
