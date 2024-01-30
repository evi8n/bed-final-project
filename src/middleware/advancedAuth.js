import { auth } from 'express-oauth2-jwt-bearer';

const authMiddleware = auth({
    audience: 'https://my_booking_app',
    issuerBaseURL: `https://dev-qba48wbjjco1tcit.eu.auth0.com/`,
    tokenSigningAlg: 'RS256'
});

export default authMiddleware;
