//reviews.js
import express from 'express';
import notFoundErrorHandler from '../middleware/notFoundErrorHandler.js';
import NotFoundError from '../errors/NotFoundError.js';
import auth from "../middleware/auth.js";
import getReviews from '../services/reviews/getReviews.js';
import createReview from '../services/reviews/createReview.js';
import getReviewById from '../services/reviews/getReviewById.js';
import updateReviewById from '../services/reviews/updateReviewById.js';
import removeReviewById from '../services/reviews/removeReviewById.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const reviews = await getReviews();
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while getting the list of reviews!');
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { userId, propertyId, rating, comment } = req.body;

        if (!userId || !propertyId || !rating || !comment) {
            return res.status(400).send('Missing required fields');
        }
        const newReview = await createReview(userId, propertyId, rating, comment);
        res.status(201).json(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while creating a new review!');
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const review = await getReviewById(id)

        res.status(200).json(review);
    } catch (error) {
        next(error)
    }
}, notFoundErrorHandler);

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { userId, propertyId, rating, comment } = req.body;

    try {
        const updatedReview = await updateReviewById(id, userId, propertyId, rating, comment);
        res.status(200).json(updatedReview);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            console.error('Error in updateReviewById:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const review = await removeReviewById(id);

    if (review !== null) {
        res.status(200).json(review);
    } else {
        res.status(404).json({
            error: `Review with id ${id} not found.`,
        });
    }
});


export default router;