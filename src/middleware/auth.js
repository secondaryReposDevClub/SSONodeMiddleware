// middleware function to use to interact with auth server
const axios = require('axios');

const auth = async (req, res, next) => {

    const { token, rememberme } = req.cookies;

    // only keep this option when working with html/ejs applications
    if (!token) {
        return next();
    }

    const config = {
        headers: {
            'access-token': token,
            'refresh-token': rememberme
        },
    };

    try {
        // we have the token, so verify it
        const body = ''; // empty body as we don't need to send anything

        const { data } = await axios.post('http://localhost:3000/auth/verify-token', body, config); // leave an empty body
        req.user = data.user;
        next();
    } catch (err) {
        res.clearCookie('token');
        next(err);
    }
}
