const Movie = require("../models/movie.model.js");
const handlerServerError = require("../utills/error");

const getMovies = async (_req, res) => {
  try {
    const movies = await Movie.find();
    res.json({ movies });
  } catch (error) {
    handlerServerError(error, res, 500, {
      message: "Unable to retrive movies",
    });
  }
};

const postMovie = async (req, res) => {
  const newMovie = req.body; //geting data from client

  try {
    //saving data to mongoDB
    const movie = new Movie(newMovie);
    await movie.save();
    res.status(201).json({ message: "Movie saved" });
  } catch (error) {
    handlerServerError(error, res, 500, { message: "Movie not saved" });
  }
};

const updateMovie = async (req, res) => {
  const movieId = req.params.movieId;
  const updatedMovieData = req.body;

  try {
    await Movie.findByIdAndUpdate(movieId, updatedMovieData);
    const updatedMovie = await Movie.findById(movieId);
    res.json({ message: "Movie updated", movie: updatedMovie });
  } catch (error) {
    handlerServerError(error, res, 500, { message: "Movie not updated" });
  }
};

const deleteMovie = async (req, res) => {
  const movieId = req.params.movieId;

  try {
    await Movie.findByIdAndDelete(movieId);

    res.status(200).json({ message: "Movie deleted" });
  } catch (error) {
    handlerServerError(error, res, 500, { message: "Movie not deleted" });
  }
};

module.exports = { getMovies, postMovie, updateMovie, deleteMovie };
