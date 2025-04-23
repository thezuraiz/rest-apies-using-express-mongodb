import express from "express";

const app = express();

// Routes
// Http methods: GET / POST / PATCH / DELETE

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome Zuraiz" });
});

export default app;
