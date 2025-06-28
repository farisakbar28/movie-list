import {
  loadMoviesData,
  getAllMovies,
  getMoviesByGenre,
  searchMovies,
  getMovieById,
  getLatestMovies,
  addMovieToFavorites,
  removeMovieFromFavorites,
  isMovieFavorite,
  getFavoriteMovies,
} from "./dataHandler.js";
import {
  createMovieCard,
  renderMovieList,
  showMoviePopup,
  hideMoviePopup,
  showNotification,
  hideNotification,
  showConfirmation,
  hideConfirmation,
} from "./ui.js";

const movieContent = document.getElementById("movieContent");
const searchForm = document.getElementById("search");
const searchInput = document.getElementById("searchInput");
const popupCloseButton = document.getElementById("popupClose");
const popupElement = document.getElementById("popup");
const popupAddFavoriteButton = document.getElementById("popupAddFavorite");
const favoriteMovieListContainer = document.getElementById("favoriteMovieList");

const renderMovieSections = () => {
  const actionMovies = getMoviesByGenre("Action");
  renderMovieList(document.getElementById("actionMovieList"), actionMovies);

  const comedyMovies = getMoviesByGenre("Comedy");
  renderMovieList(document.getElementById("comedyMovieList"), comedyMovies);

  const horrorMovies = getMoviesByGenre("Horror");
  renderMovieList(document.getElementById("horrorMovieList"), horrorMovies);

  const latestMovieListContainer = document.getElementById("latestMovieList");
  const latestMovies = getLatestMovies(4);
  renderMovieList(latestMovieListContainer, latestMovies, true);

  const noFavoritesMessage = document.getElementById("noFavoritesMessage");
  const favoriteMovies = getFavoriteMovies();
  if (favoriteMovies.length > 0) {
    renderMovieList(favoriteMovieListContainer, favoriteMovies, true);
    noFavoritesMessage.style.display = "none";
  } else {
    favoriteMovieListContainer.innerHTML = "";
    noFavoritesMessage.style.display = "block";
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadMoviesData();
  renderMovieSections();

  movieContent.addEventListener("click", (event) => {
    const showButton = event.target.closest(".show_button");
    if (showButton) {
      const movieId = showButton.dataset.movieId;
      const movie = getMovieById(movieId);
      if (movie) {
        showMoviePopup(movie);
      }
    }
  });

  document
    .getElementById("latestMovieList")
    .addEventListener("click", (event) => {
      const showButton = event.target.closest(".show_button.side");
      if (showButton) {
        const movieId = showButton.dataset.movieId;
        const movie = getMovieById(movieId);
        if (movie) {
          showMoviePopup(movie);
        }
      }
    });

  favoriteMovieListContainer.addEventListener("click", async (event) => {
    const showButton = event.target.closest(".show_button.side");
    if (showButton) {
      const movieId = showButton.dataset.movieId;
      const movie = getMovieById(movieId);
      if (movie) {
        showMoviePopup(movie);
      }
    }

    const removeButton = event.target.closest(".remove_favorite_button");
    if (removeButton) {
      const movieId = removeButton.dataset.movieId;
      const movie = getMovieById(movieId);
      if (movie) {
        const confirmed = await showConfirmation(
          `Apakah Anda yakin ingin menghapus "${movie.title}" dari favorit Anda?`
        );
        if (confirmed) {
          if (removeMovieFromFavorites(movieId)) {
            showNotification(`"${movie.title}" telah dihapus dari favorit.`);
            renderMovieSections();
          } else {
            showNotification(`Gagal menghapus "${movie.title}" dari favorit.`);
          }
        }
      }
    }
  });

  movieContent.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add_button");
    if (addButton) {
      const movieId = addButton.dataset.movieId;
      const movie = getMovieById(movieId);
      if (!movie) return;

      if (!isMovieFavorite(movieId)) {
        if (addMovieToFavorites(movieId)) {
          showNotification(
            `Berhasil Menambahkan Film Favorit: ${movie.title}!`
          );
          addButton.textContent = "Favorited";
          addButton.classList.add("favorited");
          addButton.dataset.isFavorite = "true";
          renderMovieSections();
        }
      } else {
        showNotification(`"${movie.title}" sudah ada di favorit Anda!`);
      }
    }
  });

  popupAddFavoriteButton.addEventListener("click", (event) => {
    const movieId = event.target.dataset.movieId;
    const movie = getMovieById(movieId);
    if (!movie) return;

    if (!isMovieFavorite(movieId)) {
      if (addMovieToFavorites(movieId)) {
        showNotification(`Berhasil Menambahkan Film Favorit: ${movie.title}!`);
        event.target.textContent = "Favorited";
        event.target.classList.add("favorited");
      }
    } else {
      showNotification(`"${movie.title}" sudah ada di favorit Anda!`);
    }
    renderMovieSections();
    hideMoviePopup();
  });

  popupCloseButton.addEventListener("click", hideMoviePopup);
  popupElement.addEventListener("click", (event) => {
    if (event.target === popupElement) {
      hideMoviePopup();
    }
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      const searchResults = searchMovies(query);
      movieContent.innerHTML = "";

      const searchSection = document.createElement("article");
      searchSection.className = "movie_list";
      searchSection.id = "searchResults";
      searchSection.innerHTML = `
        <h2 class="movie_list_title">Hasil Pencarian untuk "${query}"</h2>
        <p class="movie_list_text">Ditemukan ${searchResults.length} film</p>
        <section id="searchMovieList" class="card_container"></section>
      `;
      movieContent.appendChild(searchSection);
      renderMovieList(
        searchSection.querySelector(".card_container"),
        searchResults
      );

      if (searchResults.length === 0) {
        searchSection.querySelector(
          ".card_container"
        ).innerHTML = `<p style="text-align: center; color: rgba(255,255,255,0.7);">Tidak ada film yang cocok dengan pencarian Anda untuk "${query}".</p>`;
        showNotification(`Tidak ada film ditemukan untuk "${query}".`);
      }
    } else {
      movieContent.innerHTML = `
            <article class="movie_list">
              <h2 class="movie_list_title">Action</h2>
              <p class="movie_list_text">Get ready for an adventure</p>
              <section id="actionMovieList" class="card_container"></section>
            </article>

            <article class="movie_list">
              <h2 class="movie_list_title">Comedy</h2>
              <p class="movie_list_text">Get ready for a laugh</p>
              <section id="comedyMovieList" class="card_container"></section>
            </article>

            <article class="movie_list">
              <h2 class="movie_list_title">Horror</h2>
              <p class="movie_list_text">Get ready for a scare</p>
              <section id="horrorMovieList" class="card_container"></section>
            </article>
        `;
      renderMovieSections();
      showNotification("Kolom pencarian kosong. Menampilkan semua film.");
    }
  });
});
