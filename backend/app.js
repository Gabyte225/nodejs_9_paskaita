const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const {
  getMovies,
  postMovie,
  updateMovie,
  deleteMovie,
} = require("./controllers/movie.controller");

//Middlewere
app.use(express.json());
app.use(
  cors({
    origin: process.env.DOMAIN || "http://127.0.0.1:5500",
  })
);

//connection to mongoDB
require("./config/db")(app, PORT, process.env.MONGODB_URI);

//Routes

//GET - get all movies

app.get("/api/movies", getMovies);

//POST - create single movie

app.post("/api/movies", postMovie);

//PUT - update single movie

app.put("/api/movies/:movieId", updateMovie);

//DELETE - delete single movie

app.delete("/api/movies/:movieId", deleteMovie);
