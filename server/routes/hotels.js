const express = require("express");
const router = express.Router();
const hotels = require("../../data/hotels.json");
const haversine = require("../utils/haversine");

router.get("/", (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.json([]);

  const nearby = hotels.filter(hotel => {
    const dist = haversine(lat, lon, hotel.lat, hotel.lon);
    return dist <= 5;
  });

  res.json(nearby);
});

module.exports = router;
