import type { RequestHandler } from "@sveltejs/kit";

import { error, json } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { PrismaErrorHandler } from "$lib/PrismaErrorHandler";

export const GET: RequestHandler = async () => {
    try {
        const theEnd = new Date();
        theEnd.setDate(28);
        theEnd.setMonth(3);
        theEnd.setFullYear(2022);
        theEnd.setHours(0, 0, 0, 0);

        const today = new Date();
        let days = theEnd.getTime() - today.getTime();
        days = days / (1000 * 3600 * 24);
    } catch (error) {}
};
