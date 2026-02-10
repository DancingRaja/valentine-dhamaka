const express = require("express");
const path = require("path");

const app = express();

// Path to your frontend public folder
const publicPath = path.join(__dirname, "../public");

// Serve static assets from the public folder
app.use(express.static(publicPath));

// Route for the home page
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

// Fallback — serve index.html for any other routes (SPA style)
app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
