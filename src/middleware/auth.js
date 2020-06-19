// middleware function to use to interact with auth server
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// SSO Url for refreshing tokens that are about to expire
const SSO_Refresh_URL = 'http://localhost:8000/auth/refresh-token';
const SSO_Login_URL = 'http://localhost:8000/user/login?serviceURL=';

// Client url, this string should be equal to the exact base URL of the client
const clientURL = 'http://localhost:5000';

const accessTokenName = 'token'; // The default JWT token name
const refreshTokenName = 'rememberme'; // Name for remember me style tokens

const publicKey = fs.readFileSync(path.resolve(__dirname, './public.pem')); // Public Key path

// Max time remaining for token expiry, after which a refresh request will be sent to the SSO for refreshing the token
const maxTTL = 20 * 60; // 5 minutes

// Url for handling redirects, if none is provided than the user will automatically be redirected
// to the SSO Login Page
const redirectUrl = null;
// Array of public paths, these paths will be available without logging in
const publicPaths = [];

// Push the redirectURL to public paths array as the redirectURL should be accessible to all users
publicPaths.push(redirectUrl);

const auth = async (req, res, next) => {
    // Extract tokens from cookies
    const token = req.cookies[accessTokenName];
    const refreshToken = req.cookies[refreshTokenName];

    // If one of them is found, proceed to verification
    if (token || refreshToken) {
        try {
            // verify the token signature
            const decoded = await jwt.verify(token, publicKey, { algorithms: ['RS256'] });

            const tokenAgeRemaining = decoded.exp - Math.floor(Date.now() / 1000);
            // Send a refresh request to the SSO Server if the time remaining is less than maxTTL
            if (tokenAgeRemaining <= maxTTL && tokenAgeRemaining > 0) {
                const body = {
                    token: token,
                    rememberme: refreshToken,
                };
                await axios.post(SSO_Refresh_URL, body);
            }

            // Store the user in a req variable
            req.user = decoded.user;

            next();
        } catch (err) {
            // If an error occurs, clear the JWT cookies
            res.clearCookie(accessTokenName);
            res.clearCookie(refreshTokenName);
            req.user = null;
            // If the requested URL is a public path, proceed without any checks
            if (publicPaths.indexOf(req.originalUrl) !== -1) next();
            else {
                if (redirectUrl != null) res.redirect(redirectUrl);
                else res.redirect(SSO_Login_URL + clientURL + req.originalUrl);
            }
        }
    } else {
        req.user = null;
        // If the requested URL is a public path, proceed without any checks
        if (publicPaths.indexOf(req.originalUrl) !== -1) {
            next();
        } else {
            if (redirectUrl != null) res.redirect(redirectUrl);
            else res.redirect(SSO_Login_URL + clientURL + req.originalUrl);
        }
    }
};

module.exports = auth;
