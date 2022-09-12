// To get geo coords of current device location.
var lat;
var lon;
var locord;
var Info;


var orient;
if(window.innerWidth > 720){
    orient = "landscape";
}else{
    orient = "portrait";
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


function postToSever(locord){
    const xhr = new XMLHttpRequest();
    xhr.open("POST","/home", true);
    var locordData = JSON.stringify(locord);
    // console.log(locordData)
    xhr.send(locordData);
    getWeatherinfo();
}


function getWeatherinfo(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","/home", true)
    xhr.onload = function(){
        Info = JSON.parse(this.response);
        updateHTML(Info);
    }
    xhr.send();
}

// random background images from unsplash

function getrandompic(){
    const xhr = new XMLHttpRequest();
    const url = "/backPic"
    xhr.open("POST", url, true)
    xhr.onload = function(){
        var imgurl = JSON.parse(this.response)
        var userName = imgurl.user.name;
        var userlink = imgurl.user.links.html;
        var pageLink = imgurl.links.html;
        imgurl = imgurl.urls.regular;
        changeBackground(imgurl, userName, userlink, pageLink);
    }
    xhr.send(JSON.stringify(orient));
}
getrandompic();


function changeBackground(imgurl, userName, userlink, pageLink){
    document.body.style.backgroundImage = "url("+imgurl+")";
    document.querySelector(".credits").innerHTML = `<h3>©Photo by <a href="${userlink}"><span>${userName}</span></a> on <a href="${pageLink}"><span>unsplash</span></a></h3>`;
    document.querySelector(".credits").classList.remove("visibility");
}


setInterval(()=>{
    getrandompic();
}, 60000);


function updateHTML(Info){
    document.querySelector(".city").innerHTML = "Weather in "+ Info.name;
    document.querySelector(".temphead").innerHTML = Math.floor(Info.main.temp) + "°C";
    document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${Info.weather[0].icon}@2x.png`;
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
    xhr.open("POST", "/query", true);
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
        xhr.open("POST", "/query", true);
        xhr.onload = function(){
            Info = JSON.parse(this.response)
            if(Info.cod === "404"){
                alert(Info.message)
                return
            }
            updateHTML(Info);
        }
        xhr.send(JSON.stringify(query));
    }
})


