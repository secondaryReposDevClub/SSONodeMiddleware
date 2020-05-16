const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const notesRoutes = require('./routes/notes');

const port = 5000;
const app = express();

require('dotenv').config({ path: `${__dirname}/../.env` });
// extract Database URL from the environment variables
const db_url = process.env.DB_URL;

mongoose
    .connect(db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to the database...');
    })
    .catch((err) => {
        console.log(err);
    });

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded());

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

// this is the middleware every client will need and thats it.
const auth = async (req, res, next) => {
    const { token } = req.cookies;

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
};

app.get('/', (req, res) => {
    //we must have the user in req.user by now
    const user = req.user;

    return res.render('index');
});

app.get('/home', (req, res) => {
    res.send('Home page');
});

// route requests to the notes router
app.use('/notes', notesRoutes);

app.listen(port, () => {
    console.log(`Test server up and running on port:${port}`);
});
