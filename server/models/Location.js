let socket;
let watchId;

function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  // Connect socket.io
  socket = io();

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const data = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: Date.now()
      };

      // Send location to server
      socket.emit("location-update", data);

      if (typeof updateMap === "function") {
        updateMap(data.lat, data.lon);
      }

      if (typeof fetchHotels === "function") {
        fetchHotels(data.lat, data.lon);
      }
    },
    (err) => {
      alert("Location access denied or unavailable");
      console.error(err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  );
}

function stopTracking() {
  if (watchId) navigator.geolocation.clearWatch(watchId);
}
