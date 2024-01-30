// getBookings.js
import { PrismaClient } from "@prisma/client";

const getBookings = async (id) => {
    const prisma = new PrismaClient();

    return prisma.booking.findMany({
        where: {
            id
        }
    });
}

export default getBookings;