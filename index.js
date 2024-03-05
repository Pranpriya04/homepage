const express = require('express');
const axios = require('axios');
const path = require("path");
const app = express();
var bodyParser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT || 5500;

const base_url = "http://localhost:3000";

app.set("views",path.join(__dirname,"/public/views"));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static(__dirname + '/public'));

app.get("/",async(req, res) => {
    try {
        const response = await axios.get(base_url + '/books');
        res.render("home", );
    } catch (err){
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("")


//-------------------------------------------------------------------------

app.listen(PORT, () => {
    console.log('Sever started on post 5500');
});