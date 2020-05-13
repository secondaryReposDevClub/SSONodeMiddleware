const express = require('express');
const axios = require('axios');

const port = 5000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

const extractToken = (req,res,next) => {
    const { token } = req.query;
    req.token = token;
    next();
}

app.use(extractToken);

const auth = async (req,res,next) => {
    const token = req.token; // or we can also use this, req.token || req.header('x-auth-token'); depends on the client

    if(!token) {
        // then we should redirect to the SSO server
        const redirectURL = `${req.protocol}://${req.headers.host}${req.path}`;

        return res.redirect('http://localhost:3000?serviceURL=' + redirectURL);
    }

    const config = {
        headers : {
            'x-auth-token' : token
        }
    }

    try {    
        // else we have the token, so verify it
        const data = await axios.post('http://localhost:3000/auth',null,config);
        req.user = data.user;
        next();
    }
    catch(err) {
        console.log(err);
    }
}

app.get('/home', auth ,(req, res) => {
    // we must have the user in req.user by now
    const user = req.user;
    return res.json({user})
});

app.listen(port, () => {
    console.log(`Test server up and running on port:${port}`);
});