//bookings.js
import express from 'express';
import notFoundErrorHandler from '../middleware/notFoundErrorHandler.js';
import NotFoundError from '../errors/NotFoundError.js';
import auth from "../middleware/auth.js";
import getBookings from '../services/bookings/getBookings.js';
import createBooking from '../services/bookings/createBooking.js';
import getBookingById from '../services/bookings/getBookingById.js';
import updateBookingById from '../services/bookings/updateBookingById.js';
import removeBookingById from '../services/bookings/removeBookingById.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { userId, propertyId } = req.query;

        const bookings = await getBookings(userId, propertyId);
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while getting the list of bookings!');
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests,
            totalPrice, bookingStatus } = req.body;

        if (!userId || !propertyId || !checkinDate || !checkoutDate || !numberOfGuests ||
            !totalPrice || !bookingStatus) {
            return res.status(400).send('Missing required fields');
        }

        const newBooking = await createBooking(userId, propertyId, checkinDate, checkoutDate, numberOfGuests,
            totalPrice, bookingStatus);
        res.status(201).json(newBooking);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while creating new booking!');
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const booking = await getBookingById(id)

        res.status(200).json(booking);
    } catch (error) {
        next(error)
    }
}, notFoundErrorHandler);

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests,
        totalPrice, bookingStatus } = req.body;

    try {
        const updatedBooking = await updateBookingById(id, userId, propertyId, checkinDate, checkoutDate, numberOfGuests,
            totalPrice, bookingStatus);
        res.status(200).json(updatedBooking);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            console.error('Error in updateBookingById:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const booking = await removeBookingById(id);

    if (booking !== null) {
        res.status(200).json(booking);
    } else {
        res.status(404).json({
            error: `Booking with id ${id} not found.`,
        });
    }
});


export default router;