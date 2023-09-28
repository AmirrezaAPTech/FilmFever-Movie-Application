const imgPath = "https://image.tmdb.org/t/p/w1280";
const moviesContainer = document.querySelector(".movies-container");
const searchInput = document.querySelector(".search-input");
const errorContainer = document.querySelector(".error-container");
const popupContainer = document.querySelector(".movie-popup-container");
const prevPageBtn = document.querySelector(".prev-page-btn");
const nextPageBtn = document.querySelector(".next-page-btn");
const changePageContainer = document.querySelector(".change-page-container");
let pageNumber = 1;

async function showPopularMovies(pageNumber) {
  if (pageNumber >= 5) {
    nextPageBtn.disabled = true;
  } else {
    nextPageBtn.disabled = false;
  }
  console.log(pageNumber);
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=6e5b6b2314e578d49c97f36a1e28bd43&page=${pageNumber}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  const popularMovies = await data.results;
  showMovies(popularMovies);
  console.log(popularMovies);
}
showPopularMovies(pageNumber);

async function showSearchMovies() {
  const apiUrl =
    'https://api.themoviedb.org/3/search/movie?api_key=a0814a81d9e0ea8e164320078c18b3cb&query="';
  const response = await fetch(apiUrl + searchInput.value);
  const data = await response.json();
  const movies = await data.results;
  console.log(movies);
  if (movies.length === 0) {
    errorContainer.classList.remove("hidden");
    errorContainer.classList.add("flex");
  } else {
    errorContainer.classList.add("hidden");
    errorContainer.classList.remove("flex");
    showMovies(movies);
  }
}

function showMovies(movies) {
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add(
      "movie-container",
      "rounded-t-xl",
      "overflow-hidden",
      "shadow-[0_0_5px_1px_black]",
      "bg-[#13688c]",
      "my-8",
      "mx-auto",
      "transition-transform",
      "ease-in-out",
      "duration-300",
      "cursor-pointer",
      "hover:scale-110",
      "max-[280px]:w-[200px]",
      "max-[450px]:w-[250px]",
      "max-[575px]:w-[200px]"
    );
    movieContainer.innerHTML = `<img src="${imgPath}${
      movie.poster_path
    }" alt="${movie.title}" class="w-[100%] object-cover">
    <div class="movie-info flex justify-between items-center pt-2 px-3 pb-8 font-bold">
        <h4 class="movie-title ">${movie.title}</h4>
        <h4 class="movie-rate bg-[#373b69] p-1 rounded-md ml-3">${movie.vote_average.toFixed(
          1
        )}</h4>
    </div>`;
    const movieRate = movieContainer.querySelector(".movie-rate");
    const voteAverage = movie.vote_average;
    if (voteAverage >= 7.5) {
      movieRate.style.color = "greenyellow";
    } else if (voteAverage >= 5 && voteAverage < 7.5) {
      movieRate.style.color = "orange";
    } else if (voteAverage >= 0 && voteAverage < 5) {
      movieRate.style.color = "red";
    }
    moviesContainer.appendChild(movieContainer);
    movieContainer.addEventListener("click", () => {
      showPopupInfo(movie);
      popupContainer.classList.toggle("flex");
      popupContainer.classList.remove("hidden");
    });
  });
}

searchInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    if (searchInput.value === "") {
      moviesContainer.innerHTML = "";
      errorContainer.classList.add("hidden");
      changePageContainer.classList.remove("hidden");
      showPopularMovies();
    } else {
      changePageContainer.classList.add("hidden");
      moviesContainer.innerHTML = "";
      showSearchMovies();
    }
  }
});

function showPopupInfo(movie) {
  const moviePopup = document.createElement("div");
  moviePopup.classList.add(
    "movie-popup",
    "relative",
    "w-[60%]",
    "max-[768px]:w-[85%]",
    "max-[575px]:w-full",
    "bg-[#83cfdf]",
    "p-8",
    "rounded-2xl"
  );
  moviePopup.innerHTML = `
  <button class="popup-close-btn absolute right-4 top-2 text-2xl bg-transparent border-none cursor-pointer hover:text-[#00000099]"><i class="fa-solid fa-x"></i></button>
    <div class="popup-header flex justify-between items-center pt-4 pb-9 max-[575px]:flex-wrap">
                        <h1 class="popup-title text-4xl font-bold">${
                          movie.title
                        }</h1>
                        <p class="popup-rate ">${movie.vote_average.toFixed(
                          1
                        )} / 10</p>
                    </div>
                    <div class="popup-body grid grid-cols-[25%,75%] max-[575px]:block">
                        <img src="${imgPath}${movie.poster_path}" alt="${
                          movie.title
                        }" class=" w-full rounded-md overflow-hidden object-cover">
                        <div class="popup-info my-0 mr-8 ml-4 text-justify flex flex-col flex-nowrap justify-between">
                        <div>
                            <h2 class="text-2xl font-bold">About the movie</h2>
                            <p class="font-bold text-lg my-3 mx-0">${
                              movie.overview
                            }</p>

                            <p class="font-bold">Release Date : ${
                              movie.release_date
                            }</p>
                        </div>
                            <button class="popup-buy-btn py-2 px-9 text-xl cursor-pointer border-none rounded-3xl bg-[#708ed2] transition-transform duration-200 ease-in-out text-center hover:bg-[#708ed2cc] hover:scale-110">Buy</button>
                        </div>`;
  const closeBtn = moviePopup.querySelector(".popup-close-btn");
  closeBtn.addEventListener("click", () => {
    popupContainer.classList.toggle("flex");
    popupContainer.classList.toggle("hidden");
    moviePopup.remove("div");
  });

  popupContainer.appendChild(moviePopup);
}

nextPageBtn.addEventListener("click", () => {
  if (pageNumber < 5) {
    pageNumber++;
    moviesContainer.innerHTML = "";
    showPopularMovies(pageNumber);
    prevPageBtn.disabled = false;
  }
});

prevPageBtn.addEventListener("click", () => {
  if (pageNumber > 1) {
    pageNumber--;
    moviesContainer.innerHTML = "";
    showPopularMovies(pageNumber);
  }
});
