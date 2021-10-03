const jwt = require('jsonwebtoken');
const APP_SECRET = '123456789';

const getTokenPayload = (token) => {
    return jwt.verify(token, APP_SECRET);
}

const getUserId = (req, authToken) => {
    if(req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            if(!token) {
                throw new Error('No token around');
            }
            const { userId } = getTokenPayload(token);
            return userId;
        }
    } else if (authToken) {
        const { userId } = getTokenPayload(authToken);
        return userId;
    }
    throw new Error('Not authanticated');
}

module.exports = {
    APP_SECRET,
    getUserId
}