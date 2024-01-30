//createHost.js
import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

const createHost = async (username, password, name, email, phoneNumber, profilePicture, aboutMe) => {
    const prisma = new PrismaClient();

    try {
        const result = await prisma.host.create({
            data: {
                id: uuid(),
                username,
                password,
                name,
                email,
                phoneNumber,
                profilePicture,
                aboutMe
            }
        });

        return result;
    } catch (error) {
        console.error('Error creating host:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export default createHost;