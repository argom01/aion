import type { RequestHandler } from "@sveltejs/kit";

import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
    const holidays: [string, boolean][] = [
        ["2022-11-01", false],
        ["2022-11-11", false],
        ["2022-12-15", true],
        ["2022-12-23", true],
        ["2022-12-31", false],
        ["2023-01-01", false],
        ["2023-01-06", false],
        ["2023-01-09", true], //
        ["2023-01-13", false], ///przewidywany egzamin,
        ["2023-02-13", true],
        ["2023-02-24", false],
        ["2023-03-13", true], //
        ["2023-03-17", false], //przewidywane rekolekcje
        ["2023-04-06", true],
        ["2023-04-11", false],
        ["2023-04-20", true],
        ["2023-04-21", false],
    ];

    let i = 0;
    let days = 0;
    let date = new Date();
    while (i < holidays.length) {
        const holidayDate = new Date(holidays[i][0]);
        if (date < holidayDate) {
            if (![0, 6].includes(date.getDay())) {
                days += 1;
            }
            date.setDate(date.getDate() + 1);
        } else if (
            date.getMonth() === holidayDate.getMonth() &&
            date.getDate() === holidayDate.getDate()
        ) {
            if (holidays[i][1]) {
                date = new Date(holidays[i + 1][0]);
            } else {
                date.setDate(date.getDate() + 1);
            }
            i++;
        } else {
            i++;
        }
    }

    return json({ daysLeft: days });
};
