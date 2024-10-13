
// Check if geolocation is supported by the browser
if ("geolocation" in navigator) {
// Prompt user for permission to access their location
navigator.geolocation.getCurrentPosition(
    // Success callback function
    (position) => {
    // Get the user's latitude and longitude coordinates
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // Do something with the location data, e.g. display on a map
    // console.log(`Latitude: ${lat}, longitude: ${lng}`);
    var latId = document.getElementById("lat");
    var longId = document.getElementById("long");
    latId.innerHTML = lat;
    longId.innerHTML = lng;
    },
    // Error callback function
    (error) => {
    // Handle errors, e.g. user denied location sharing permissions
    console.error("Error getting user location:", error);
    }
);
} else {
// Geolocation is not supported by the browser
console.error("Geolocation is not supported by this browser.");
}

function getLocation() {
    var latId = document.getElementById("lat");
    var longId = document.getElementById("long");
    var lat = latId.innerHTML;
    var long = longId.innerHTML;
    console.log(`Latitude: ${lat}, longitude: ${long}`);

    // Send a post request to the server
    fetch("/location", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, long }),
    })
}

var run;
function startStop(){
    var start_stop = document.getElementById("startstop");
    if(start_stop.innerHTML == "Start"){
        start_stop.innerHTML = "Stop";
        start();
    } else {
        start_stop.innerHTML = "Start";
        stop();
    }
}

function start() {
    run = setInterval(getLocation, 5000);
}

function save() {
    // Send a post request to the server to save the location
    fetch("/save", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    })
}

function clear() {
    // Send a post request to the server to clear
    fetch("/clear", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    })
}


function stop() {
    clearInterval(run);
    save();
    // Pause for a second before clearing
    setTimeout(clear, 1000);
}
