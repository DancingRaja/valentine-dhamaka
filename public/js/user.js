const socket = io();
let map, userMarker;
let hasUpdatedMap = false;
let hotelMarkers = [];

// Initialize map centered on India (default)
map = L.map("map").setView([20, 78], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Custom User Icon
const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom Hotel Icon (Gold/Yellow ideally, or Blue)
const hotelIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


userMarker = L.marker([0, 0], { icon: userIcon }).addTo(map);

function startTracking() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported by your browser");
        return;
    }

    // Hide the overlay
    document.getElementById("permissionOverlay").style.display = "none";
    const msgElement = document.querySelector(".msg");
    if (msgElement) {
        msgElement.style.display = "block";
        msgElement.textContent = "Locating nearby romantic stays...";
    }

    navigator.geolocation.watchPosition(
        (pos) => {
            const { latitude: lat, longitude: lon } = pos.coords;

            // Send live data to server
            socket.emit("live-location", { lat, lon, id: socket.id });

            if (!hasUpdatedMap) {
                userMarker.setLatLng([lat, lon]);
                map.setView([lat, lon], 14); // Zoom in closer
                userMarker.bindPopup("<b>You are here</b><br>Ready for love!").openPopup();
                hasUpdatedMap = true;

                // Mock finding hotels
                if (msgElement) msgElement.textContent = "Searching for real hotels nearby...";

                if (window.generateNearbyHotels) {
                    window.generateNearbyHotels(lat, lon).then(hotels => {
                        if (hotels.length === 0) {
                            if (msgElement) msgElement.textContent = "No hotels found nearby. Try a different location!";
                            return;
                        }

                        if (msgElement) {
                            const isReal = hotels[0] && hotels[0].isReal;
                            msgElement.textContent = isReal
                                ? `Found ${hotels.length} hotels nearby!`
                                : "No hotels found nearby. Showing suggested romantic spots.";
                        }

                        hotels.forEach(h => {
                            const marker = L.marker([h.lat, h.lon], { icon: hotelIcon }).addTo(map);
                            marker.bindPopup(`
                                <div style="text-align:center; font-family:'Poppins',sans-serif;">
                                    <h3 style="margin:0; color:#b83b48;">${h.name}</h3>
                                    <p style="margin:5px 0;">${h.description}</p>
                                    <b style="color:#d4af37;">${h.isReal ? '~' : ''}$${h.price} / night</b><br>
                                    <span style="color:#f39c12;">★ ${h.rating}</span>
                                    <br><button style="margin-top:5px; padding:5px 10px; border:none; background:#b83b48; color:white; border-radius:10px; cursor:pointer;">Book Now</button>
                                </div>
                            `);
                            hotelMarkers.push(marker);
                        });
                    });
                }
            }
        },
        (err) => {
            console.error(err);
            alert("Please allow location access to find hotels nearby.");
            document.getElementById("permissionOverlay").style.display = "flex";
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}
