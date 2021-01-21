const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const path = require('path');
const routes = require('./routes/routes');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));

app.use('/', routes);

app.listen(PORT, (err) => {
    if(err) return console.log(err);
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});