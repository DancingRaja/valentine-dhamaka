function fetchHotels(lat, lon) {
  fetch(`/api/hotels?lat=${lat}&lon=${lon}`)
    .then(res => res.json())
    .then(hotels => {
      const list = document.getElementById("hotels");
      list.innerHTML = "";
      hotels.forEach(h => {
        const li = document.createElement("li");
        li.textContent = h.name;
        list.appendChild(li);
      });
    });
}
