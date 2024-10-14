// Check if geolocation is supported by the browser
if ("geolocation" in navigator) {
    // Create a variable to hold the watch ID for later clearing
    let watchId;

    // Function to start watching the location
    function startWatchLocation() {
        watchId = navigator.geolocation.watchPosition(
            // Success callback function
            (position) => {
                // Get the user's latitude and longitude coordinates
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Update the location on the page
                var latId = document.getElementById("lat");
                var longId = document.getElementById("long");
                latId.innerHTML = lat;
                longId.innerHTML = lng;

                // Optionally, log to console for debugging
                console.log(`Latitude: ${lat}, Longitude: ${lng}`);
            },
            // Error callback function
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.error("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.error("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        console.error("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.error("An unknown error occurred.");
                        break;
                }
            },
            // Options for geolocation
            {
                enableHighAccuracy: true,
                timeout: 5000,  // Timeout to get the location (5 seconds)
                maximumAge: 0   // No cache, always get the latest location
            }
        );
    }

    // Function to stop watching the location
    function stopWatchLocation() {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            console.log("Location tracking stopped.");
        }
    }

    // Toggle start and stop location tracking
    function startStop() {
        var start_stop = document.getElementById("startstop");
        if (start_stop.innerHTML == "Start") {
            start_stop.innerHTML = "Stop";
            startWatchLocation();
            start();
        } else {
            start_stop.innerHTML = "Start";
            stopWatchLocation();
            stop();
        }
    }

    // Function to send the current location to the server
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
        });
    }

    // Automatically send location every 5 seconds if start is clicked
    var run;
    function start() {
        run = setInterval(getLocation, 5000);
    }

    function stop() {
        clearInterval(run);
        save();
        // Pause for a second before clearing
        setTimeout(clear, 1000);
    }

    // Send a post request to save the location
    function save() {
        fetch("/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });
    }

    // Send a post request to clear the location data
    function clear() {
        fetch("/clear", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });
    }
} else {
    // Geolocation is not supported by the browser
    console.error("Geolocation is not supported by this browser.");
}
