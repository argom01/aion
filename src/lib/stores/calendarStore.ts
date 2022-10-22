import { writable, readable, derived } from "svelte/store";

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

// const createSelectedMonthData = () => {
//     const fetchMonthData = async (m: number, y: number) => {
//         selectedDay.selectDay(null);
//         const response = await fetch(
//             `http://localhost:5173/api/get-events/${m + 1}/${y}`
//         );
//
//         if (response.status === 200) {
//             const data = await response.json();
//             today.setMonth(m);
//             today.setFullYear(y);
//             return data;
//         } else {
//             throw new Error(response.statusText);
//         }
//     };
//
//     const { subscribe, set } = writable(
//         fetchMonthData(today.getMonth(), today.getFullYear())
//     );
//
//     return {
//         subscribe,
//         fetchMonth: (m: number, y: number) => set(fetchMonthData(m, y)),
//         incrementMonth: () =>
//             set(fetchMonthData(today.getMonth() + 1, today.getFullYear())),
//         decrementMonth: () =>
//             set(fetchMonthData(today.getMonth() - 1, today.getFullYear())),
//     };
// };
// export const selectedMonthData = createSelectedMonthData();
