//amenities.js
import express from 'express';
import notFoundErrorHandler from '../middleware/notFoundErrorHandler.js';
import NotFoundError from '../errors/NotFoundError.js';
import auth from "../middleware/auth.js";
import getAmenities from '../services/amenities/getAmenities.js';
import createAmenity from '../services/amenities/createAmenity.js';
import getAmenityById from '../services/amenities/getAmenityById.js';
import updateAmenityById from '../services/amenities/updateAmenityById.js';
import removeAmenityById from '../services/amenities/removeAmenityById.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { name } = req.query;

        const amenities = await getAmenities(name);
        res.status(200).json(amenities);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while getting list of amenities!');
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send('Missing required fields');
        }
        const newAmenity = await createAmenity(name);
        res.status(201).json(newAmenity);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while creating new amenity!');
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const amenity = await getAmenityById(id)

        res.status(200).json(amenity);
    } catch (error) {
        next(error)
    }
}, notFoundErrorHandler);

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedAmenity = await updateAmenityById(id, name);
        res.status(200).json(updatedAmenity);
    } catch (error) {
        if (error instanceof NotFoundError) {
            // Send a custom error response for the "record not found" scenario
            res.status(404).json({ error: `Amenity with id ${id} not found.` });
        } else {
            // Handle other types of errors or log them
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const amenity = await removeAmenityById(id);

    if (amenity !== null) {
        res.status(200).json(amenity);
    } else {
        res.status(404).json({
            error: `Amenity with id ${id} not found.`,
        });
    }
});


export default router;