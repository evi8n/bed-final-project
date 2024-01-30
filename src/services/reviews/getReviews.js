// getReviews.js
import { PrismaClient } from "@prisma/client";

const getReviews = async () => {
    const prisma = new PrismaClient();

    try {
        return await prisma.review.findMany();
    } finally {
        await prisma.$disconnect();
    }
}

export default getReviews;