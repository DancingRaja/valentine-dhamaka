const socket = io();

let map = L.map("map").setView([20, 78], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
.addTo(map);

let marker = null;

socket.on("admin-live-location", (data) => {

  console.log("LIVE USER:", data);

  if (!marker) {
    marker = L.marker([data.lat, data.lon]).addTo(map);
  }

  marker.setLatLng([data.lat, data.lon]);
  map.setView([data.lat, data.lon], 16);

});
