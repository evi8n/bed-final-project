import { PrismaClient } from '@prisma/client'
import usersData from '../data/users.json' assert { type: "json" }
import hostsData from '../data/hosts.json' assert { type: "json" }
import propertiesData from '../data/properties.json' assert { type: "json" }
import amenitiesData from '../data/amenities.json' assert { type: "json" }
import bookingsData from '../data/bookings.json' assert { type: "json" }
import reviewsData from '../data/reviews.json' assert { type: "json" }

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

async function main() {
    const { users } = usersData
    const { hosts } = hostsData
    const { properties } = propertiesData
    const { amenities } = amenitiesData
    const { bookings } = bookingsData
    const { reviews } = reviewsData

    try {
        //seed users
        for (const user of users) {
            await prisma.user.upsert({
                where: { id: user.id },
                update: {},
                create: user,
            })
        }

        //seed hosts
        for (const host of hosts) {
            await prisma.host.upsert({
                where: { id: host.id },
                update: {},
                create: host,
            })
        }

        //seed properties
        for (const property of properties) {
            await prisma.property.upsert({
                where: { id: property.id },
                update: {},
                create: property,
            })
        }

        //seed amenities
        for (const amenity of amenities) {
            await prisma.amenity.upsert({
                where: { id: amenity.id },
                update: {},
                create: amenity,
            })
        }

        //seed bookings
        for (const booking of bookings) {
            await prisma.booking.upsert({
                where: { id: booking.id },
                update: {},
                create: booking,
            })
        }

        //seed reviews
        for (const review of reviews) {
            await prisma.review.upsert({
                where: { id: review.id },
                update: {},
                create: review,
            })
        }

        console.log('Data seeding completed succesfully.')
    } catch (error) {
        console.error('Error during data seeding:', error)
    } finally {
        await prisma.$disconnect()
    }
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })