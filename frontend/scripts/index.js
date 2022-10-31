import { api } from "./api.js";

//Variables
//--DOM elements
const moviesFilterByCategoryElement = document.querySelector(
  "#movies-filter-by-category"
);

const moviesFilterByPriceElement = document.querySelector(
  "#movies-filter-by-price"
);

const moviesContainerElement = document.querySelector("#movies-container");

const paginationElement = document.querySelector("#pagination");
const inputElement = document.querySelector("#input");
const searchButtonElement = document.querySelector("#search-button");

//--logic

let movies = [];
let category;
let page = 1;
let itemsPerPage = 10;

//Functions
//-- get all movies

const getMovies = async () => {
  const data = await api.getData();
  //   console.log(data);
  movies.push(...data.movies);

  generateOptionTags(data.movies);

  showMoviesByPagination(data.movies);
  loadPaginationFooter(data.movies);

  searchMovie(data.movies);
};

//-- generate <option> tags for filtering <select>

const generateOptionTags = (moviesArray, filterType = null) => {
  //for category filter
  if (!filterType) {
    const categoriesArray = new Set(moviesArray.map((movie) => movie.category));

    // console.log(categoriesArray);

    //-- creating all movies option
    const allMoviesOption = document.createElement("option");
    allMoviesOption.setAttribute("value", "all-movies");
    allMoviesOption.innerText = "All movies";

    moviesFilterByCategoryElement.appendChild(allMoviesOption);

    //-- creating other category options based on categoriesArray
    categoriesArray.forEach((category) => {
      const option = document.createElement("option");
      option.setAttribute("value", category);
      option.innerText = category;

      moviesFilterByCategoryElement.appendChild(option);
    });
  }

  //for price filter
  if (!filterType || filterType === "category") {
    if (filterType === "category") {
      while (moviesFilterByPriceElement.firstChild) {
        moviesFilterByPriceElement.removeChild(
          moviesFilterByPriceElement.firstChild
        );
      }
    }
    const rentPricesArray = new Set(
      moviesArray.map((movie) => movie.rentPrice).sort((a, b) => a - b)
    );

    //creating all prices option
    const allPrices = document.createElement("option");
    allPrices.setAttribute("value", "all-prices");
    allPrices.innerText = "All prices";

    moviesFilterByPriceElement.appendChild(allPrices);

    //creating other options based on rent prices array
    rentPricesArray.forEach((price) => {
      const option = document.createElement("option");
      option.setAttribute("value", price);
      option.innerText = price.toFixed(2) + "$";

      moviesFilterByPriceElement.appendChild(option);
    });
  }
};

//-- show movies

const showMovies = (moviesArray) => {
  while (moviesContainerElement.firstChild) {
    moviesContainerElement.removeChild(moviesContainerElement.firstChild);
  }
  moviesArray.forEach((movie) => {
    const div = document.createElement("div");
    const h4 = document.createElement("h4");
    const pForCategory = document.createElement("p");
    const pForPrice = document.createElement("p");

    h4.innerText = movie.name;
    pForCategory.innerText = movie.category;
    pForPrice.innerText = movie.rentPrice.toFixed(2) + "$";

    div.append(h4, pForCategory, pForPrice);

    moviesContainerElement.appendChild(div);
  });
};

//--filtering movies
//-- -- filtering by category

const filterMoviesByCategory = (e) => {
  category = e.target.value;

  if (category === "all-movies") {
    showMoviesByPagination(movies);
    generateOptionTags(movies, "category");
  } else {
    const filteredMovies = movies.filter(
      (movie) => movie.category === category
    );

    showMoviesByPagination(filteredMovies);
    generateOptionTags(filteredMovies, "category");
  }
};
//-- -- filtering by price

const filterMoviesByPrice = (e) => {
  const currentPrice = e.target.value;
  if (category === "all-movies" && currentPrice === "all-prices") {
    showMoviesByPagination(movies);
  } else if (currentPrice === "all-prices") {
    const filteredMovies = movies.filter(
      (movies) => movies.category === category
    );
    showMoviesByPagination(filteredMovies);
  } else {
    let filteredMovies;
    if (category && category !== "all-movies") {
      filteredMovies = movies.filter(
        (movie) =>
          movie.rentPrice === +currentPrice && movie.category === category
      );
    } else {
      filteredMovies = movies.filter(
        (movie) => movie.rentPrice === +currentPrice
      );
    }
    showMoviesByPagination(filteredMovies);
  }
};

// -- -- pagination

const showMoviesByPagination = (moviesArray) => {
  let from = (page - 1) * itemsPerPage;
  let to = page * itemsPerPage;
  moviesArray = moviesArray.slice(from, to);

  showMovies(moviesArray);
};

const loadPaginationFooter = (moviesArray) => {
  for (let i = 0; i < moviesArray.length / itemsPerPage; i++) {
    const span = document.createElement("span");
    span.innerText = i + 1;
    span.addEventListener("click", (e) => {
      page = e.target.innerText;

      showMoviesByPagination(moviesArray);
    });

    paginationElement.appendChild(span);
  }
};

// -- --search for movies
const searchMovie = (moviesArray) => {
  searchButtonElement.addEventListener("click", (e) => {
    e.preventDefault();
    const inputSearchMovie = inputElement.value.toUpperCase();
    // console.log(inputSearchMovie);

    let newArray = [];

    for (let i = 0; i < moviesArray.length; i++) {
      let movies = moviesArray[i];
      let listOfMoviesNames = movies.name.toUpperCase();

      if (listOfMoviesNames.indexOf(inputSearchMovie) > -1) {
        newArray.push(movies);
      } else {
        console.log("There is no movie with that name");
      }
    }

    showMoviesByPagination(newArray);
  });
};

//Events

document.addEventListener("DOMContentLoaded", getMovies);
moviesFilterByCategoryElement.addEventListener(
  "change",
  filterMoviesByCategory
);
moviesFilterByPriceElement.addEventListener("change", filterMoviesByPrice);
