const express = require('express');

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.get('/', (req, res, next) => {
    //Check if user has been authorized
    const user = req.user;

    //if user is not fund, redirect to auth server
    if (!user) {
        return res.redirect('http://sso.devclub.in/auth/');
    } 
    
    //else render the homepage
    return res.render('index');
});

app.listen(port, () => {
    console.log(`Test server up and running on port:${port}`);
});