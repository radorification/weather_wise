const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
var path = require("path");

const app = express();

const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

require ('dotenv').config();

app.set("view engine", "ejs");

app.get('/', (req, res)=>{
    const sendData = {cityName: 'Location', temp: 'temp', wind_speed:'--', weatherCondition:"Weather Condition"};
    res.render("index", {sendData: sendData});
});

app.post('/', async (req, res)=>{
    let location = await req.body.city;
    const url = `https://api.weatherapi.com/v1/current.json?key=${process.env.APIKEY}&q=${location}&aqi=no`;
    const response = await fetch(url);
    const weatherData = await response.json();
    const cityName = weatherData.location.name;
    const temp = weatherData.current.temp_c;
    const weatherCondition = weatherData.current.condition.text;
    const humidity = weatherData.current.humidity;
    const wind_speed = weatherData.current.wind_kph;
    //const weatherIcon = weatherData.current.icon;

    const sendData = {};
    sendData.temp = temp;
    sendData.cityName = cityName;
    sendData.weatherCondition = weatherCondition;
    sendData.wind_speed = wind_speed;
    sendData.humidity = humidity;
    res.render('index', {sendData: sendData});
})

app.listen(port,()=>{
    console.log("running")
})
