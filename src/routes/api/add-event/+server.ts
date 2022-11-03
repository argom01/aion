import type { TAddEventData } from "src/types/event.types";
import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from '@sveltejs/kit';
import prisma from "$lib/prisma";
import { prismaErrorHandler } from "$lib/prismaErrorHandler";

const validateEvent = (e: TAddEventData) => {
    const start = new Date(e.beginning);
    if (e.ending) {
        const end = new Date(e.ending);
        if (end.getTime() < start.getTime()) {
            return false;
        }

        if (end.getDate() !== start.getDate()) {
            return false;
        }
    }

    if (e.isPeriodical) {
        if (!e.repeatPeriod || !e.repeatPeriodUnit) {
            return false;
        }

        if (e.repeatPeriod <= 0) {
            return false;
        }
    }

    if (e.dateBoundary && e.numberOfRepeatsBoundary) {
        return false;
    }

    if (e.dateBoundary) {
        const dateBoundry = new Date(e.dateBoundary);
        if (dateBoundry < start) {
            return false;
        }
    }

    return true;
};

function typeCheck(obj: any): obj is TAddEventData {
    return (obj.beginning && obj.title);
}

export const POST: RequestHandler = async ({ request }) => {
    if (!request.body) {
        throw error(400, "No request body");
    }

    const event: TAddEventData | any = await request.json();

    if (!typeCheck(event)) {
        throw error(400, "Missing or invalid data");
    }

    if (!validateEvent(event)) {
        throw error(400, "Missing or invalid data");
    }

    let dateBoundary: Date | undefined = undefined;

    if (event.dateBoundary) {
        dateBoundary = new Date(event.dateBoundary);
    } else if (event.numberOfRepeatsBoundary) {
        const n = event.numberOfRepeatsBoundary;
        const p = event.repeatPeriod;
        dateBoundary = new Date(event.beginning);

        switch (event.repeatPeriodUnit) {
            case "DAY":
                const numberOfDays = p! * n;
                dateBoundary.setDate(dateBoundary.getDate() + numberOfDays);
                break;
            case "WEEK":
                const numberOfDaysW = p! * n * 7;
                dateBoundary.setDate(
                    dateBoundary.getDate() + numberOfDaysW
                );
                break;
            case "MONTH":
                const numberOfMonths = p! * n;
                dateBoundary.setMonth(
                    dateBoundary.getMonth() + numberOfMonths
                );
                break;
            case "YEAR":
                const numberOfYear = p! * n;
                dateBoundary.setFullYear(
                    dateBoundary.getFullYear() + numberOfYear
                );
                break;
        }
    }

    try {
        const insertedEvent = await prisma.event.create({
            data: {
                beginTime: new Date(event.beginning),
                endTime: !event.ending ? null : new Date(event.ending),
                title: event.title,
                description: event.description,
                place: event.place,
                isPeriodical: event.isPeriodical,
                repeatPeriod: event.repeatPeriod,
                repeatPeriodUnit: event.repeatPeriodUnit,
                dateBoundary: dateBoundary,
            },
        });

        return json({ status: "ok", event: insertedEvent });
    } catch (error) {
        prismaErrorHandler(error);
    }
    throw error(500);
};
