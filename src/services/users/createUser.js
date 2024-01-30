//createUser.js

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const createUser = async (username, password, name, email, phoneNumber, profilePicture) => {

    return prisma.user.create({
        data: {
            username,
            password,
            name,
            email,
            phoneNumber,
            profilePicture
        }
    });
}

export default createUser;