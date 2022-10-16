import type { RequestHandler } from '@sveltejs/kit';

import prisma from "$lib/prisma";
import { error, json } from '@sveltejs/kit';
import { prismaErrorHandler } from '$lib/prismaErrorHandler';

export const DELETE: RequestHandler = async ({ params }) => {
    const id = params.id;
    if (!id) {
        throw error(404, "No such event");
    }

    try {
        await prisma.event.delete({
            where: {
                id: id,
            },
        });

        return json({ status: "ok" })
    } catch (error) {
        prismaErrorHandler(error);
    }
    throw error(500);
};

