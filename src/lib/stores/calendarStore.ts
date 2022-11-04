import type { TEventResponse } from "src/types/event.types";
import { writable, derived, readable } from "svelte/store";

const today = new Date();
today.setMonth(today.getMonth())
today.setDate(1);

const createSelectedMonth = () => {
    const { subscribe, update } = writable(today);
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
            const data: { [k: string]: TEventResponse[] } =
                await response.json();
            today.setMonth(m);
            today.setFullYear(y);
            return data;
        } else {
            throw new Error(response.statusText);
        }
    };

    return fetchMonthData(
        $selectedMonth.getMonth(),
        $selectedMonth.getFullYear()
    );
});

export const selectedDayData = derived(
    [selectedMonthData, selectedDay],
    (
        [$selectedMonthData, $selectedDay],
    ) => {
        if ($selectedDay) {
            return $selectedMonthData.then(e => e[$selectedDay]).catch(() => [])
        } else {
            return []
        }

    }
);

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
        const response = await fetch('http://localhost:5173/api/days-until-liberation');
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

