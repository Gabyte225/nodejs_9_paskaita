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

//--logic

let movies = [];
let category;

//Functions
//-- get all movies

const getMovies = async () => {
  const data = await api.getData();
  //   console.log(data);
  movies.push(...data.movies);

  generateOptionTags(data.movies);
  showMovies(data.movies);
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
    showMovies(movies);
    generateOptionTags(movies, "category");
  } else {
    const filteredMovies = movies.filter(
      (movie) => movie.category === category
    );

    showMovies(filteredMovies);
    generateOptionTags(filteredMovies, "category");
  }
};
//-- -- filtering by price

const filterMoviesByPrice = (e) => {
  const currentPrice = e.target.value;
  if (category === "all-movies" && currentPrice === "all-prices") {
    showMovies(movies);
  } else if (currentPrice === "all-prices") {
    const filteredMovies = movies.filter(
      (movies) => movies.category === category
    );
    showMovies(filteredMovies);
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
    showMovies(filteredMovies);
  }
};

//Events

document.addEventListener("DOMContentLoaded", getMovies);
moviesFilterByCategoryElement.addEventListener(
  "change",
  filterMoviesByCategory
);
moviesFilterByPriceElement.addEventListener("change", filterMoviesByPrice);
