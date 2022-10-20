import { writable } from "svelte/store";

function createMonth() {
    const today = new Date();
    const fetchMonthData = async (m: number, y: number) => {
        const response = await fetch(
            `http://localhost:5173/api/get-events/${m + 1}/${y}`
        );

        if (response.status === 200) {
            const data = await response.json();
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
    };
}
export const selectedMonth = createMonth();

// function createDay() {
//     const { subscribe, set } = writable(null);
//     const getEventsList = async (d: number) => {
//         let events;
//         await selectedMonth.subscribe((e) => {
//             try {
//                 const data = await e;
//                 events = data[d];
//             } catch (error) {
//                 events = null;
//             }
//         });
//     };
//
//     return {
//         subscribe,
//         selectDay: (d: number) => set(getEventsList(d)),
//     };
// }
