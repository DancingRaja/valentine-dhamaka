const socket = io();

const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

let marker = null;

socket.on("location-update", (data) => {
  const { lat, lng } = data;

  if (!marker) {
    marker = L.marker([lat, lng]).addTo(map);
    map.setView([lat, lng], 16);
  } else {
    marker.setLatLng([lat, lng]);
    map.panTo([lat, lng]);
  }
});
