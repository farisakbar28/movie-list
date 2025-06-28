import { isMovieFavorite } from "./dataHandler.js";

export const createMovieCard = (movie, isSideCard = false) => {
  const isFav = isMovieFavorite(movie.id);
  const buttonText = isFav ? "Favorited" : "Add Favorite";
  const buttonClass = isFav ? "add_button favorited" : "add_button";

  if (isSideCard) {
    return `
      <div class="side_card_group" data-movie-id="${movie.id}">
        <img class="side_card_image" src="${movie.image}" alt="${
      movie.title
    }" />
        <div class="side_card_body">
          <div class="side_card_credits">
            <p>Director: ${movie.director || "N/A"}</p>
            <p>Cast: ${movie.cast ? movie.cast.join(", ") : "N/A"}</p>
          </div>
          <h2 class="side_card_title">${movie.title}</h2>
          <div class="side_card_info">
            <p><img src="src/assets/star_icon.svg" alt="Star icon" />${
              movie.rating
            }</p>
            <p><img src="src/assets/calendar_icon.svg" alt="Calendar icon" />${
              movie.year
            }</p>
            <button class="show_button side" type="button" data-movie-id="${
              movie.id
            }">
              <img src="src/assets/help_icon.svg" alt="Help icon" />
            </button>
          </div>
        </div>
        ${
          isFav
            ? `<button class="remove_favorite_button" data-movie-id="${movie.id}">&times;</button>`
            : ""
        }
      </div>
    `;
  } else {
    return `
      <div class="card_group" data-movie-id="${movie.id}">
        <div class="card_header">
          <img class="card_img" src="${movie.image}" alt="${movie.title}" />
          <div class="card_info">
            <p><img src="src/assets/star_icon.svg" alt="Star icon" />${
              movie.rating
            }</p>
            <p><img src="src/assets/calendar_icon.svg" alt="Calendar icon" />${
              movie.year
            }</p>
            <p><img src="src/assets/genre_icon.svg" alt="Clapperboard icon" />${movie.genres.join(
              ", "
            )}</p>
          </div>
        </div>
        <div class="card_body">
          <h3>${movie.title}</h3>
          <div class="card_buttons">
            <button class="${buttonClass}" type="button" data-movie-id="${
      movie.id
    }" data-is-favorite="${isFav}">
              <img src="src/assets/add_icon.svg" alt="Add button" />${buttonText}
            </button>
            <button class="show_button" type="button" data-movie-id="${
              movie.id
            }">
              <img src="src/assets/help_icon.svg" alt="Help icon" />
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

export const renderMovieList = (container, movies, isSideCard = false) => {
  container.innerHTML = movies
    .map((movie) => createMovieCard(movie, isSideCard))
    .join("");
};

export const showMoviePopup = (movie) => {
  const popup = document.getElementById("popup");
  document.getElementById("popupImage").src = movie.image;
  document.getElementById("popupImage").alt = movie.title;
  document.getElementById("popupTitle").textContent = movie.title;
  document.getElementById("popupRating").textContent = movie.rating;
  document.getElementById("popupYear").textContent = movie.year;
  document.getElementById("popupGenres").textContent = movie.genres.join(", ");
  document.getElementById("popupDirector").textContent =
    movie.director || "N/A";
  document.getElementById("popupCast").textContent = movie.cast
    ? movie.cast.join(", ")
    : "N/A";
  document.getElementById("popupDescription").textContent =
    movie.description || "No description available.";

  const popupAddFavoriteButton = document.getElementById("popupAddFavorite");
  const isFav = isMovieFavorite(movie.id);
  popupAddFavoriteButton.textContent = isFav ? "Favorited" : "Add Favorite";
  popupAddFavoriteButton.classList.toggle("favorited", isFav);
  popupAddFavoriteButton.dataset.movieId = movie.id;

  popup.style.display = "block";
};

export const hideMoviePopup = () => {
  document.getElementById("popup").style.display = "none";
};

const notificationPopup = document.getElementById("notificationPopup");
const notificationMessage = document.getElementById("notificationMessage");
const notificationCloseButton = document.getElementById(
  "notificationCloseButton"
);

export const showNotification = (message, duration = 3000) => {
  notificationMessage.textContent = message;
  notificationPopup.style.display = "flex";
  setTimeout(() => {
    hideNotification();
  }, duration);
};

export const hideNotification = () => {
  notificationPopup.style.display = "none";
};

if (notificationCloseButton) {
  notificationCloseButton.addEventListener("click", hideNotification);
}

const confirmationPopup = document.getElementById("confirmationPopup");
const confirmationMessage = document.getElementById("confirmationMessage");
const confirmYesButton = document.getElementById("confirmYesButton");
const confirmNoButton = document.getElementById("confirmNoButton");

let resolveConfirmationPromise;

export const showConfirmation = (message) => {
  return new Promise((resolve) => {
    confirmationMessage.textContent = message;
    confirmationPopup.style.display = "flex";
    resolveConfirmationPromise = resolve;

    const handleYes = () => {
      confirmationPopup.style.display = "none";
      resolveConfirmationPromise(true);
      confirmYesButton.removeEventListener("click", handleYes);
      confirmNoButton.removeEventListener("click", handleNo);
    };

    const handleNo = () => {
      confirmationPopup.style.display = "none";
      resolveConfirmationPromise(false);
      confirmYesButton.removeEventListener("click", handleYes);
      confirmNoButton.removeEventListener("click", handleNo);
    };

    confirmYesButton.addEventListener("click", handleYes);
    confirmNoButton.addEventListener("click", handleNo);

    confirmationPopup.addEventListener(
      "click",
      (event) => {
        if (event.target === confirmationPopup) {
          confirmationPopup.style.display = "none";
          resolveConfirmationPromise(false);
          confirmYesButton.removeEventListener("click", handleYes);
          confirmNoButton.removeEventListener("click", handleNo);
        }
      },
      { once: true }
    );
  });
};

export const hideConfirmation = () => {
  confirmationPopup.style.display = "none";
};
