const romanticHotelNames = [
  "Rosewood Retreat",
  "Cupid's Cove Resort",
  "The Love Nest Inn",
  "Passion Palace Hotel",
  "Valentine's View Suties",
  "Amour Grand Hotel",
  "Heartbeat Haven",
  "Soulmate Sanctuary"
];

const messages = [
  "Perfect for a candlelight dinner",
  "Includes a private jacuzzi",
  "Stunning sunset views",
  "Complimentary champagne on arrival",
  "Cozy fireplace suites available"
];

function generateNearbyHotels(lat, lon) {
  const hotels = [];
  // Generate 4-6 hotels
  const count = Math.floor(Math.random() * 3) + 4;

  for (let i = 0; i < count; i++) {
    // Random offset within ~2km (approx 0.02 degrees)
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lonOffset = (Math.random() - 0.5) * 0.02;

    hotels.push({
      name: romanticHotelNames[Math.floor(Math.random() * romanticHotelNames.length)],
      lat: lat + latOffset,
      lon: lon + lonOffset,
      price: Math.floor(Math.random() * 200) + 100, // $100 - $300
      rating: (4 + Math.random()).toFixed(1), // 4.0 - 5.0
      description: messages[Math.floor(Math.random() * messages.length)]
    });
  }
  return hotels;
}

// Export for use in user.js (if using modules) or just global scope
window.generateNearbyHotels = generateNearbyHotels;
