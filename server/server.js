const express = require("express");
const path = require("path");

const app = express();

const publicPath = path.join(__dirname, "public");

// ✅ Serve static files FIRST (very important)
app.use(express.static(publicPath));

// ✅ Explicit route for index
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

// ❌ DO NOT override static files
// Only fallback if file truly doesn't exist
app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
