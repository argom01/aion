import type { RequestHandler } from '@sveltejs/kit';
import type { TEventQueryOutput, TEventResponse } from 'src/types/event.types';

import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { prismaErrorHandler } from '$lib/prismaErrorHandler';

export const GET: RequestHandler = async ({ params }) => {
    try {
        const month = Number(params.month);
        const year = Number(params.year);

        const events: TEventQueryOutput[] = await prisma.$queryRaw`
        SELECT * FROM "Event"
        WHERE ('isPeriodical' = 'yes') OR
        (date_part('month', "beginTime") = ${month} AND date_part('year', "beginTime") = ${year});
        `;

        const handledEvents = handlePeriodicEvents(events, month - 1, year);
        const responseBody = arrangeEvents(handledEvents, month - 1, year);

        return json(responseBody);
    } catch (e) {
        prismaErrorHandler(e);
        throw error(500);
    }

}

const arrangeEvents = (events: TEventResponse[], month: number, year: number) => {
    const eventsByDay = new Map();
    const h = new Date();
    h.setMonth(month);
    h.setFullYear(year);
    h.setDate(1);
    while (h.getMonth() === month) {
        const d = h.getDate();
        eventsByDay.set(d, []);
        h.setDate(d + 1);
    }

    events.forEach(e => {
        const d = e.beginning.getDate();
        eventsByDay.set(d, [...eventsByDay.get(d), e]);
    });

    return Object.fromEntries(eventsByDay);
}

const handlePeriodicEvents = (
    events: TEventQueryOutput[],
    month: number,
    year: number
) => {
    const response: TEventResponse[] = [];
    events.forEach((e) => {
        if (!e.isPeriodical) {
            const event: TEventResponse = {
                beginning: e.beginTime,
                ending: e.endTime,
                title: e.title,
                description: e.description,
                place: e.place,
            };
            response.push(event);
        } else {
            let beginning = new Date(e.beginTime);
            const upperDate = new Date();
            upperDate.setFullYear(year);
            upperDate.setMonth(month + 1);
            upperDate.setDate(1);

            const lowerDate = new Date();
            lowerDate.setFullYear(year);
            lowerDate.setMonth(month);
            lowerDate.setDate(1);
            lowerDate.setHours(0, 0, 0, 0);

            let dateBoundary = !!e.dateBoundary ? e.dateBoundary : upperDate;

            if (dateBoundary >= upperDate) {
                while (beginning <= dateBoundary && beginning < upperDate) {
                    if (beginning >= lowerDate) {
                        const event: TEventResponse = {
                            beginning: new Date(beginning),
                            ending: !e.endTime
                                ? null
                                : new Date(
                                    e.endTime.setDate(beginning.getDate())
                                ),
                            title: e.title,
                            description: e.description,
                            place: e.place,
                        };

                        response.push(event);
                    }
                    const n = e.repeatPeriod!;
                    switch (e.repeatPeriodUnit) {
                        case "DAY":
                            beginning.setDate(beginning.getDate() + n);
                            break;
                        case "WEEK":
                            beginning.setDate(beginning.getDate() + n * 7);
                            break;
                        case "MONTH":
                            beginning.setMonth(beginning.getMonth() + n);
                            break;
                        case "YEAR":
                            beginning.setFullYear(beginning.getFullYear() + n);
                            break;
                    }
                }
            }
        }
    });

    return response;
};
