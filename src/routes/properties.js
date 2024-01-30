//properties.js
import express from 'express';
import notFoundErrorHandler from '../middleware/notFoundErrorHandler.js';
import NotFoundError from '../errors/NotFoundError.js';
import auth from "../middleware/auth.js";
import getProperties from '../services/properties/getProperties.js';
import createProperty from '../services/properties/createProperty.js';
import getPropertyById from '../services/properties/getPropertyById.js';
import updatePropertyById from '../services/properties/updatePropertyById.js';
import removePropertyById from '../services/properties/removePropertyById.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { location, pricePerNight } = req.query;

        const properties = await getProperties(location, pricePerNight);
        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while getting the list of properties!');
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, rating } = req.body;

        if (!title || !description || !location || !pricePerNight || !bedroomCount ||
            !bathRoomCount || !maxGuestCount || !hostId || !rating) {
            return res.status(400).send('Missing required fields');
        }
        const newProperty = await createProperty(title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, rating);
        res.status(201).json(newProperty);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while creating a new property!');
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const property = await getPropertyById(id)

        res.status(200).json(property);
    } catch (error) {
        next(error)
    }
}, notFoundErrorHandler);

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, rating } = req.body;

    try {
        const updatedProperty = await updatePropertyById(id, title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, rating);
        res.status(200).json(updatedProperty);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            console.error('Error in updatePropertyById:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const property = await removePropertyById(id);

    if (property !== null) {
        res.status(200).json(property);
    } else {
        res.status(404).json({
            error: `Property with id ${id} not found.`,
        });
    }
});


export default router;