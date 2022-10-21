import { writable } from "svelte/store";

const createSelectedMonth = () => {
    const today = new Date();
    const fetchMonthData = async (m: number, y: number) => {
        const response = await fetch(
            `http://localhost:5173/api/get-events/${m + 1}/${y}`
        );

        if (response.status === 200) {
            const data = await response.json();
            today.setMonth(m);
            today.setFullYear(y);
            console.log(data);
            return data;
        } else {
            throw new Error(response.statusText);
        }
    };

    const { subscribe, set } = writable(
        fetchMonthData(today.getMonth(), today.getFullYear())
    );

    return {
        subscribe,
        fetchMonth: (m: number, y: number) => set(fetchMonthData(m, y)),
        incrementMonth: () =>
            set(fetchMonthData(today.getMonth() + 1, today.getFullYear())),
        decrementMonth: () =>
            set(fetchMonthData(today.getMonth() - 1, today.getFullYear())),
    };
};
export const selectedMonth = createSelectedMonth()

const createSelectedDay = () => {
    const { subscribe, set } = writable<null | number>(null);

    return {
        subscribe,
        selectDay: (d: number | null) => set(d),
    };
};
export const selectedDay = createSelectedDay();
