import type { RequestHandler } from "@sveltejs/kit";
import type { TEventQueryOutput, TEventResponse } from "src/types/event.types";

import { error } from "@sveltejs/kit";
import superjson from "superjson";
import prisma from "$lib/prisma";
import { prismaErrorHandler } from "$lib/prismaErrorHandler";

export const GET: RequestHandler = async ({ params }) => {
    try {
        const month = Number(params.month);
        const year = Number(params.year);

        const events: TEventQueryOutput[] = await prisma.$queryRaw`
        SELECT * FROM "Event"
        WHERE ('isPeriodical' = 'yes') OR
        (date_part('month', "beginTime") = ${month} AND date_part('year', "beginTime") = ${year})
        ORDER BY cast("beginTime" as time);
        `;

        const handledEvents = handlePeriodicEvents(events, month - 1, year);
        const responseBody = arrangeEvents(handledEvents, month - 1, year);

        return new Response(superjson.stringify(responseBody));
    } catch (e) {
        prismaErrorHandler(e);
        throw error(500);
    }
};

const arrangeEvents = (events: TEventResponse[], month: number, year: number) => {
    const eventsByDay = new Map<number, Array<TEventResponse>>();
    const h = new Date(`${year}-${month + 1}-01`);
    while (h.getMonth() === month) {
        const d = h.getDate();
        eventsByDay.set(d, []);
        h.setDate(d + 1);
    }

    events.forEach((e) => {
        const d = e.beginning.getDate();
        const eventsSoFar = eventsByDay.get(d);
        eventsByDay.set(d, [...eventsSoFar!, e]);
    });

    return Object.fromEntries(eventsByDay);
};

const handlePeriodicEvents = (events: TEventQueryOutput[], month: number, year: number) => {
    const response: TEventResponse[] = [];
    events.forEach((e) => {
        if (!e.isPeriodical) {
            const event: TEventResponse = {
                id: e.id,
                beginning: e.beginTime,
                ending: e.endTime,
                title: e.title,
                description: e.description,
                place: e.place,
            };
            response.push(event);
        } else {
            const beginning = new Date(e.beginTime);
            const upperDate = new Date();
            upperDate.setDate(1);
            upperDate.setFullYear(year);
            upperDate.setMonth(month + 1);

            const lowerDate = new Date(`${year}-${month + 1}-01`);
            lowerDate.setHours(0, 0, 0, 0);

            const dateBoundary = !e.dateBoundary ? upperDate : e.dateBoundary;

            if (dateBoundary >= lowerDate) {
                while (beginning <= dateBoundary && beginning < upperDate) {
                    if (beginning >= lowerDate) {
                        const event: TEventResponse = {
                            id: e.id,
                            beginning: new Date(beginning),
                            ending: !e.endTime ? null : new Date(e.endTime.setDate(beginning.getDate())),
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
