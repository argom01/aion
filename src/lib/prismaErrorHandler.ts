import { Prisma } from "@prisma/client";
import { error } from '@sveltejs/kit';

export const prismaErrorHandler = (
    err: any,
) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                throw error(400, `Unique constraint violation:\n ${err.meta}`);
            case "P2001":
                throw error(404, `Record does not exist:\n ${err.meta}`);
            case "P2025":
                throw error(404, `Record does not exist:\n ${err.meta}`);
            default:
                throw error(500, `${err.code}`);
        }
    }
};
