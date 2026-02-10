let socket;
let watchId;

function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  socket = io();

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const data = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: Date.now()
      };

      socket.emit("location-update", data);

      if (typeof updateMap === "function") {
        updateMap(data.lat, data.lon);
      }
    },
    (err) => {
      alert("Location permission denied");
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
