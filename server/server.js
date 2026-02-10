const express = require("express");
const path = require("path");

const app = express();

// ✅ Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// ✅ If you are using JSON anywhere
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Main route - serves index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Catch-all route (prevents 404 on refresh or deep links)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Render requires dynamic PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
