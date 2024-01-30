//createProperty.js
import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

const createProperty = async (title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, rating) => {
    const prisma = new PrismaClient();

    try {
        const result = await prisma.property.create({
            data: {
                id: uuid(),
                title,
                description,
                location,
                pricePerNight,
                bedroomCount,
                bathRoomCount,
                maxGuestCount,
                hostId,
                rating
            }
        });

        return result;
    } catch (error) {
        console.error('Error creating property:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export default createProperty;