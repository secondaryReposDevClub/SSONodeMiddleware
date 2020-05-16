// middleware function to use to interact with auth server
const auth  = async (req,res,next) => {

    const { token } = req.cookies;

    // only keep this option when working with html/ejs applications
    if (!token) {
        // then we should redirect to the SSO server
        const redirectURL = `${req.protocol}://${req.headers.host}${req.path}`;
        return res.redirect('http://localhost:3000/user/login?serviceURL=' + redirectURL);
    }

    const config = {
        headers: {
            'auth-token': token,
        },
    };

    try {
        // we have the token, so verify it
        const body = ''; // empty body as we don't need to send anything

        const { data } = await axios.post('http://localhost:3000/auth', body, config); // leave an empty body
        req.user = data.user;
        next();
    } catch (err) {
        res.clearCookie('token');
        next(err);
    }
}

module.exports = auth;