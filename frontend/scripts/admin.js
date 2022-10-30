import { api } from "./api.js";

//Variables
//--DOM elements

const addMovieFormElement = document.querySelector("#add-movie-form");
const formSubmitMessageElement = document.querySelector("#form-submit-message");
const movieListContainerElement = document.querySelector(
  "#movie-list-container"
);
const movieUpdateDeleteMessageElement = document.querySelector(
  "#movie-update-delete-message"
);

//Functions

//-- add movie
const addMovie = async (e) => {
  e.preventDefault();
  formSubmitMessageElement.innerText = "";

  //-- validating rent price input
  if (isNaN(+e.target.movieRentPrice.value)) {
    formSubmitMessageElement.innerText = "Movie price must be a number";
    return;
  }
  //-- creating movie object which will be sended to api
  const movie = {
    name: e.target.movieName.value,
    category: e.target.movieCategory.value,
    rentPrice: +e.target.movieRentPrice.value,
  };

  const response = await api.sendData(movie);
  formSubmitMessageElement.innerText = response.message;
  formSubmitMessageElement.classList.add("message");
  addMovieFormElement.reset();
  getMovies();
};

//--get movies
const getMovies = async () => {
  const data = await api.getData();

  showMovies(data.movies);
};

//-- show movies
const showMovies = (moviesArray) => {
  while (movieListContainerElement.firstChild) {
    movieListContainerElement.removeChild(movieListContainerElement.firstChild);
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const theadRow = document.createElement("tr");
  const th1 = document.createElement("th");
  const th2 = document.createElement("th");
  const th3 = document.createElement("th");
  const th4 = document.createElement("th");
  const th5 = document.createElement("th");

  th1.innerText = "Name";
  th2.innerText = "Category";
  th3.innerText = "Rent price";
  th4.innerText = "Update";
  th5.innerText = "Delete";

  theadRow.append(th1, th2, th3, th4, th5);
  thead.appendChild(theadRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  moviesArray.forEach((movie) => {
    const tbodyRow = document.createElement("tr");
    tbodyRow.setAttribute("id", movie._id);
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    const td5 = document.createElement("td");

    td1.innerText = movie.name;
    td2.innerText = movie.category;
    td3.innerText = movie.rentPrice.toFixed(2) + "$";

    td1.setAttribute("contenteditable", true);
    td2.setAttribute("contenteditable", true);
    td3.setAttribute("contenteditable", true);

    td1.setAttribute("id", "movieName");
    td2.setAttribute("id", "movieCategory");
    td3.setAttribute("id", "movieRentPrice");

    [td1, td2, td3].forEach((td) => {
      td.addEventListener("input", (e) => {
        const id = e.target.parentNode.id;
        const buttons = document.querySelectorAll("button");

        buttons.forEach((button) => {
          if (button.dataset.movieId === id) {
            updateButton.disabled = false;
          }
        });
      });
    });

    const updateButton = document.createElement("button");
    updateButton.disabled = true;
    updateButton.innerText = "Update";
    updateButton.addEventListener("click", updateMovie);
    updateButton.setAttribute("data-movie-id", movie._id);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("data-delete-movie-id", movie._id);
    deleteButton.addEventListener("click", deleteMovie);

    td4.appendChild(updateButton);
    td5.appendChild(deleteButton);

    tbodyRow.append(td1, td2, td3, td4, td5);
    tbody.appendChild(tbodyRow);
  });

  table.appendChild(tbody);
  movieListContainerElement.appendChild(table);
};

//-- update movie

const updateMovie = async (e) => {
  const { movieId } = e.target.dataset;
  const trs = document.querySelectorAll("tr");
  const trToUpdate = Array.from(trs).find((tr) => tr.id === movieId);
  const movie = {
    name: trToUpdate.children[0].innerText,
    category: trToUpdate.children[1].innerText,
    rentPrice: trToUpdate.children[2].innerText.includes("$")
      ? +trToUpdate.children[2].innerText.substring(
          0,
          trToUpdate.children[2].innerText.length - 1
        )
      : +trToUpdate.children[2].innerText,
  };
  const response = await api.updateData(movieId, movie);

  movieUpdateDeleteMessageElement.innerText = response.message;
  movieUpdateDeleteMessageElement.className = "";
  movieUpdateDeleteMessageElement.classList.add("update-message");
  getMovies();
};

//--delete movie
const deleteMovie = async (e) => {
  const { deleteMovieId } = e.target.dataset;
  const response = await api.deleteData(deleteMovieId);

  movieUpdateDeleteMessageElement.innerText = response.message;
  movieUpdateDeleteMessageElement.className = "";
  movieUpdateDeleteMessageElement.classList.add("delete-message");
  getMovies();
};

//Events
document.addEventListener("DOMContentLoaded", getMovies);
addMovieFormElement.addEventListener("submit", addMovie);
