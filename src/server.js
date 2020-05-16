const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const notesRoutes = require('./routes/notes');
const auth = require('./middleware/auth');

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

app.get('/', auth,(req, res) => {

    //we must have the user in req.user by now
    const user = req.user;
    if (user) {
        return res.render('index');
    }

    // else we need to display login page
    res.render('login');
});

// route requests to the notes router
app.use('/notes', notesRoutes);

app.listen(port, () => {
    console.log(`Test server up and running on port:${port}`);
});
