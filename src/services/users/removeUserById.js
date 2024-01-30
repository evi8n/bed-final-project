// removeUserById.js
import { PrismaClient } from "@prisma/client";
import NotFoundError from '../../errors/NotFoundError.js';

const removeUserById = async (id) => {
    const prisma = new PrismaClient();

    // Retrieve the user to get associated booking IDs
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        include: {
            Booking: {
                select: {
                    id: true,
                },
            },
        },
    });

    if (!user) {
        throw new NotFoundError("User", id);
    }

    const bookingIds = user.Booking.map(booking => booking.id);

    // Delete associated bookings
    await prisma.booking.deleteMany({
        where: {
            id: {
                in: bookingIds,
            },
        },
    });

    // Delete the user
    const removedUser = await prisma.user.delete({
        where: {
            id,
        },
    });

    return { message: `User with id ${id} and associated bookings were deleted from the database.` };
};

export default removeUserById;
