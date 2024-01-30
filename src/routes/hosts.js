//hosts.js
import express from 'express';
import notFoundErrorHandler from '../middleware/notFoundErrorHandler.js';
import NotFoundError from '../errors/NotFoundError.js';
import auth from "../middleware/auth.js";
import getHosts from '../services/hosts/getHosts.js';
import createHost from '../services/hosts/createHost.js';
import getHostById from '../services/hosts/getHostById.js';
import updateHostById from '../services/hosts/updateHostById.js';
import removeHostById from '../services/hosts/removeHostById.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { name } = req.query;

        const hosts = await getHosts(name);
        res.status(200).json(hosts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while getting the list of hosts!');
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;

        if (!username || !password || !name || !email || !phoneNumber ||
            !profilePicture || !aboutMe) {
            return res.status(400).send('Missing required fields');
        }
        const newHost = await createHost(username, password, name, email, phoneNumber, profilePicture, aboutMe);
        res.status(201).json(newHost);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while creating a new host!');
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const host = await getHostById(id)

        res.status(200).json(host);
    } catch (error) {
        next(error)
    }
}, notFoundErrorHandler);

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;

    try {
        const updatedHost = await updateHostById(id, username, password, name, email, phoneNumber, profilePicture, aboutMe);
        res.status(200).json(updatedHost);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            console.error('Error in updateHostById:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const host = await removeHostById(id);

    if (host !== null) {
        res.status(200).json(host);
    } else {
        res.status(404).json({
            error: `Host with id ${id} not found.`,
        });
    }
});


export default router;