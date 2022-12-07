import type { TEventResponse } from "src/types/event.types";
import { writable, derived, readable } from "svelte/store";
import superjson from 'superjson';

export const today = readable(new Date());

const currentMonth = new Date();
currentMonth.setDate(1);
currentMonth.setMonth(currentMonth.getMonth());

const createSelectedMonth = () => {
    const { subscribe, update } = writable(currentMonth);
    return {
        subscribe,
        selectMonth: (m: number, y: number) =>
            update((t) => {
                t.setMonth(m);
                t.setFullYear(y);
                return t;
            }),
        incrementMonth: () =>
            update((t) => {
                t.setMonth(t.getMonth() + 1);
                return t;
            }),
        decrementMonth: () =>
            update((t) => {
                t.setMonth(t.getMonth() - 1);
                return t;
            }),
    };
};
export const selectedMonth = createSelectedMonth();

export const selectedDay = writable<number | null>(null);

export const selectedMonthData = derived(selectedMonth, ($selectedMonth) => {
    const fetchMonthData = async (m: number, y: number) => {
        selectedDay.set(null);
        const response = await fetch(`http://localhost:5173/api/get-events/${m + 1}/${y}`);

        if (response.status === 200) {
            const responseSuperJSON = await response.text();
            const data = superjson.parse<{[k: string]: TEventResponse[]}>(responseSuperJSON);
            return data;
        } else {
            throw new Error(response.statusText);
        }
    };

    return fetchMonthData($selectedMonth.getMonth(), $selectedMonth.getFullYear());
});

const createEventFormDay = () => {
    const { subscribe, set } = writable<number | null>(null);

    return {
        subscribe,
        setDay: (d: number | null) => set(d),
    };
};
export const eventFormDay = createEventFormDay();

const createDaysLeft = () => {
    const daysLeft = async () => {
        const response = await fetch("http://localhost:5173/api/days-until-liberation");
        if (response.status === 200) {
            try {
                const data = await response.json();
                return data.daysLeft;
            } catch (error) {
                throw new Error("Something went wrong");
            }
        }

        throw new Error(response.statusText);
    };

    const { subscribe } = readable(daysLeft());

    return { subscribe };
};
export const daysLeft = createDaysLeft();

