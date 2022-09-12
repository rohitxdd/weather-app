require('dotenv').config()
const express = require("express");
const axios = require('axios').default;
const helmet = require("helmet");

const app = express();

var lat;
var lon;

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    })
);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

//To get Geo Coordinate from Client device
app.post("/home", function (req, res) {
    req.on("data", function (d) {
        var coord = JSON.parse(d);
        // console.log(coord);
        lat = parseFloat(coord.lat);
        lon = parseFloat(coord.lon);
    })
})

app.get("/home", function (req, res) {
    const apiKey = process.env.WEATHER_API;
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey;

    axios({
            method: 'get',
            url: url,
            responseType: 'json'
        })
        .then(function (response) {
            //   console.log(response.data)
            res.send(response.data)
        })

        .catch(function (error) {
            console.log(error);
        });
})

//post for query
app.post("/query", function (req, res) {
    req.on("data", function (d) {
        var query = JSON.parse(d)
        const apiKey = process.env.WEATHER_API;
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=metric";

        axios({
                method: 'get',
                url: url,
                responseType: 'json'
            })
            .then(function (response) {
                //   console.log(response.data)
                res.send(response.data)
            })

            .catch(function (error) {
                console.log(error.response.data);
                res.send(error.response.data)
            });
    })
})

//for unsplash 
app.post("/backPic", (req, res) => {
    req.on("data", function (d) {
        const orient = JSON.parse(d)
        const keyID = process.env.UNSPLASH_API;
        const query = "wallpaper";
        const url = "https://api.unsplash.com/photos/random/?client_id=" + keyID + "&query=" + query + "&orientation=" + orient;
        axios({
                method: 'get',
                url: url,
                responseType: 'json'
            })
            .then(function (response) {
                res.send(response.data)
            })

            .catch(function (error) {
                console.log(error);
            }); 
    })
})



app.listen(process.env.PORT || 3000, () => {
    console.log("listening to http://localhost:3000/")
});