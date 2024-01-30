// getProperties.js
import { PrismaClient } from "@prisma/client";

const getProperties = async (id) => {
    const prisma = new PrismaClient();

    return prisma.property.findMany({
        where: {
            id
        }
    });
}

export default getProperties;
