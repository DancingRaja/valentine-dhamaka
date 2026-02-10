const socket = io();

const map = L.map("map").setView([20,78],5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
.addTo(map);

let marker = L.marker([20,78]).addTo(map);

socket.on("admin-live-location",(data)=>{

  marker.setLatLng([data.lat,data.lon]);
  map.setView([data.lat,data.lon],15);

});
