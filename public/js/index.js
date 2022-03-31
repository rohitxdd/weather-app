// To get geo coords of current device location.
console.log("test")
var lat;
var lon;
var locord;
var Info;


var orient;
if(window.innerWidth > 720){
    orient = "landscape";
    // console.log(orient)
}else{
    orient = "portrait";
    // console.log(orient)
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition , denied);
    }else{
        console.log("not supported")
    }
}
function showPosition(position){
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    locord ={
        "lat": lat,
        "lon": lon,
    };
    postToSever(locord);
}
getLocation();

//https://rohitxdd.herokuapp.com/
//using ajax to communicate with server
function postToSever(locord){
    const xhr = new XMLHttpRequest();
    xhr.open("POST","https://rohitxdd.herokuapp.com/home/", true);

    var locordData = JSON.stringify(locord);
    console.log(locordData)
    xhr.send(locordData);
    getWeatherinfo();
}


function getWeatherinfo(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","https://rohitxdd.herokuapp.com/home/", true)
    xhr.onload = function(){
        Info = JSON.parse(this.response);
        updateHTML(Info);
    }
    xhr.send();
}

// random background images from unsplash

function getrandompic(){
    const xhr = new XMLHttpRequest();
    const keyID = "Hjvwk9mpXLgSx6zdkewmydv7MvQnqMI81xFku8R9Efw";
    const query = "wallpaper";
    const url = "https://api.unsplash.com/photos/random/?client_id="+keyID+"&query="+query+"&orientation="+orient;

    xhr.open("GET", url, true)
  
    xhr.onload = function(){
        var imgurl = JSON.parse(this.response)
        imgurl = imgurl.urls.full;
        changeBackground(imgurl);
    }
    xhr.send(JSON.stringify());
}
getrandompic();


function changeBackground(imgurl){
    document.body.style.backgroundImage = "url("+imgurl+")";
}


setInterval(()=>{
    getrandompic();
}, 60000);


function updateHTML(Info){
    document.querySelector(".city").innerHTML = "Weather in "+ Info.name;
    document.querySelector(".temphead").innerHTML = Math.floor(Info.main.temp) + "°C";
    var description = Info.weather[0].description;
    document.querySelector(".description").innerHTML = description.toUpperCase();
    document.querySelector(".humidity").innerHTML = Info.main.humidity+"%";
    document.querySelector(".wind").innerHTML = Info.wind.speed+" Meter per second.";
    document.querySelector(".card").classList.remove("hidden");


}

function denied(){

    document.querySelector(".card").classList.remove("hidden");

}

//Search function query
document.querySelector(".searchBtn").addEventListener("click", function(){
    var query = (document.querySelector(".search-bar").value);
    document.querySelector(".search-bar").value = "";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://rohitxdd.herokuapp.com/query/", true);
    xhr.onload = function(){
        Info = JSON.parse(this.response)
        updateHTML(Info);
    }
    xhr.send(JSON.stringify(query));
})


document.querySelector(".search-bar").addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        var query = (document.querySelector(".search-bar").value);
        document.querySelector(".search-bar").value = "";
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "https://rohitxdd.herokuapp.com/query/", true);
        xhr.onload = function(){
            Info = JSON.parse(this.response)
            updateHTML(Info);
        }
        xhr.send(JSON.stringify(query));
    }
})



