let map = L.map("map").setView([0, 0], 15);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
let marker = L.marker([0, 0]).addTo(map);

function updateMap(lat, lon) {
  marker.setLatLng([lat, lon]);
  map.setView([lat, lon]);
}
