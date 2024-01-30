//createAmenity.js
import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

const createAmenity = async (name) => {
    const prisma = new PrismaClient();

    try {
        const result = await prisma.amenity.create({
            data: {
                id: uuid(),
                name
            }
        });

        return result;
    } catch (error) {
        console.error('Error creating amenity:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export default createAmenity;