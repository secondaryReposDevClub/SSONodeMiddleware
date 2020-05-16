const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const port = 5000;
const app = express();

app.use(cors());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);


// this the middleware every client will need and thats it.
const auth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        // then we should redirect to the SSO server
        const redirectURL = `${req.protocol}://${req.headers.host}${req.path}`;
        return res.redirect('http://localhost:3000/user/login?serviceURL=' + redirectURL);
    }

    const config = {
        headers: {
            'auth-token': token
        }
    }

    try {
        // we have the token, so verify it
        const body = '' // empty body as we don't need to send anything

        const { data } = await axios.post('http://localhost:3000/auth', body, config); // leave an empty body
        req.user = data.user
        next();
    }
    catch (err) {
        res.clearCookie('token');
        next(err);
    }
}

app.get('/', auth, (req, res) => {
    // we must have the user in req.user by now
    const user = req.user;

    return res.render('index', { user })
});

app.get('/home',(req, res) => {
    res.send('Home page');
});

app.listen(port, () => {
    console.log(`Test server up and running on port:${port}`);
});