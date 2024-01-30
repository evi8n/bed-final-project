//users.js
import express from 'express';
import notFoundErrorHandler from '../middleware/notFoundErrorHandler.js';
import NotFoundError from '../errors/NotFoundError.js';
import auth from "../middleware/auth.js";
import getUsers from '../services/users/getUsers.js';
import createUser from '../services/users/createUser.js';
import getUserById from '../services/users/getUserById.js';
import updateUserById from '../services/users/updateUserById.js';
import removeUserById from '../services/users/removeUserById.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { username, email } = req.query;

        const users = await getUsers(username, email);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while getting the list of users!');
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { username, password, name, email, phoneNumber, profilePicture } = req.body;

        if (!username || !password || !name || !email || !phoneNumber || !profilePicture) {
            return res.status(400).send('Missing required fields');
        }
        const newUser = await createUser(username, password, name, email, phoneNumber, profilePicture);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while creating a new user!');
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await getUserById(id)

        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}, notFoundErrorHandler);

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, name, email, phoneNumber, profilePicture } = req.body;


        const updatedUser = await updateUserById(id, username, password, name, email, phoneNumber, profilePicture);
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            console.error('Error in updateUserById:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const user = await removeUserById(id);
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            console.error('Error in removeUserById:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});


export default router;