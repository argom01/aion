import { writable, derived } from "svelte/store";

const today = new Date();

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

const createSelectedDay = () => {
    const { subscribe, set } = writable<null | number>(null);

    return {
        subscribe,
        selectDay: (d: number | null) => set(d),
    };
};
export const selectedDay = createSelectedDay();

export const selectedMonthData = derived(selectedMonth, ($selectedMonth) => {
    const fetchMonthData = async (m: number, y: number) => {
        selectedDay.selectDay(null);
        const response = await fetch(
            `http://localhost:5173/api/get-events/${m + 1}/${y}`
        );

        if (response.status === 200) {
            const data = await response.json();
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
    ([$selectedMonthData, $selectedDay], set) => {
        if ($selectedDay) {
            $selectedMonthData
                .then((e) => set(e[$selectedDay]))
                .catch(() => set([]));
        }
    },
    []
);
