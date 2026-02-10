const socket = io();

let map;
let userMarker;
let hotelMarkers = [];
let hasUpdatedMap = false;

map = L.map("map").setView([20, 78], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
.addTo(map);

// ⭐ Fetch Nearby Hotels from OpenStreetMap
async function fetchHotels(lat, lon) {

  try {

    const query = `
      [out:json];
      (
        node["tourism"="hotel"](around:1500,${lat},${lon});
        way["tourism"="hotel"](around:1500,${lat},${lon});
      );
      out center;
    `;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: query
      }
    );

    const data = await response.json();

    // Remove old hotel markers
    hotelMarkers.forEach(marker => map.removeLayer(marker));
    hotelMarkers = [];

    data.elements.forEach(hotel => {

      let hLat = hotel.lat || hotel.center?.lat;
      let hLon = hotel.lon || hotel.center?.lon;

      if (!hLat || !hLon) return;

      const name = hotel.tags?.name || "Unnamed Hotel";

      const marker = L.marker([hLat, hLon])
        .addTo(map)
        .bindPopup(`🏨 ${name}`);

      hotelMarkers.push(marker);
    });

    document.querySelector(".msg").textContent =
      `${hotelMarkers.length} hotels found nearby!`;

  } catch (err) {
    console.error("Hotel fetch error:", err);
  }
}

function startTracking() {

  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  document.getElementById("permissionOverlay").style.display = "none";

  navigator.geolocation.watchPosition(
    async (pos) => {

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      socket.emit("live-location", { lat, lon });

      if (!userMarker) {
        userMarker = L.marker([lat, lon]).addTo(map);
      }

      if (!hasUpdatedMap) {
        map.setView([lat, lon], 15);
        hasUpdatedMap = true;
      }

      userMarker.setLatLng([lat, lon]);

      // ⭐ Fetch real hotels
      fetchHotels(lat, lon);

    },
    (err) => {
      alert("Please allow location access.");
      console.error(err);
    },
    {
      enableHighAccuracy: true
    }
  );
}
