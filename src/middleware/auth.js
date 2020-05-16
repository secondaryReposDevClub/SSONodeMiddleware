// middleware function to use to interact with auth server
const axios = require('axios');

const auth = async (req, res, next) => {

    const { token, rememberme } = req.cookies;
    if (token || rememberme) {
        const config = {
            headers: {
                'access-token': token ? token : 'placeholder',
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
            req.user = null;
            next();
        }
    } else {
        req.user = null;
        res.redirect('/');
    }
}

module.exports = auth;