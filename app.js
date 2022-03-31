const express = require("express");
const https = require("https");
const app = express();

var lat;
var lon;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));


app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

//to pass cors 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//To get Geo Coordinate from Client device
app.post("/home", function(req,res){
    req.on("data",function(d){
        var coord = JSON.parse(d);
        lat = parseFloat(coord.lat);
        lon = parseFloat(coord.lon);
    })
})

app.get("/home", (req, res)=>{
    const apiKey = "5e7ee7faf08b4e1507679e05c3ecb9d7";
    const url = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&appid="+apiKey;
    https.get(url,(response)=>{
        response.on("data",(d)=>{
            var Info = JSON.parse(d)
            // console.log(Info)
            res.send(Info)
        })
    })
})

//post for query
app.post("/query", function(req,res){
    req.on("data", function(d){
        var query = JSON.parse(d)
        const apiKey = "5e7ee7faf08b4e1507679e05c3ecb9d7";
        const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query + "&appid="+ apiKey +"&units=metric";
        https.get(url,(response)=>{
            response.on("data", (d)=>{
                var Info = JSON.parse(d);
                res.send(Info)
            })
        })
    })
})

//for unsplash 
// var fullUrl;
// app.post("/backPic", (req, res)=>{
//     req.on("data", function(d){
//         const orient = JSON.parse(d)
//         const keyID = "Hjvwk9mpXLgSx6zdkewmydv7MvQnqMI81xFku8R9Efw";
//         const query = "wallpaper";
//         const url = "https://api.unsplash.com/photos/random/?client_id="+keyID+"&query="+query+"&orientation="+orient;
//         https.get(url , (response)=>{
//             response.on("data", function(urlink){
                
//                 // var data = urlink.toJSON()
//                 // fullUrl = JSON.parse(urlink);
//                 // console.log(fullUrl)
//                 // res.send(fullUrl)
//             })
//         }) 
//     })
// })



app.listen(process.env.PORT ||3000 , ()=>{
    console.log("listening to http://localhost:3000/")
});



