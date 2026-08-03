import { getRandomCats, searchBreeds, getImagesByBreed } from "./api.js";
import { addFavorite, removeFavorite, getFavorites } from "./favorites.js";
import { renderCats, setStatus, onGalleryClick } from "./ui.js";

const randomBtn = document.querySelector("#cat-randomizer");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const favoritesBtn = document.querySelector("#fav-button");

const favoritesMap = new Map();
let latestRequestId = 0;

function favoriteImageIds() {
  return new Set(favoritesMap.keys());
}

async function loadFavoritesIndex() {
  try {
    const favorites = await getFavorites();
    favoritesMap.clear();
    for (const fav of favorites) favoritesMap.set(fav.image_id, fav.id);
  } catch (error) {
    console.error("Couldn't load favorites:", error);
  }
}

async function loadRandomCats() {
  const requestId = ++latestRequestId;
  try {
    setStatus("Loading cats…");
    const cats = await getRandomCats(9);
    if (requestId !== latestRequestId) return;
    renderCats(cats, { favoriteImageIds: favoriteImageIds() });
    setStatus("");
  } catch (error) {
    console.error(error);
    setStatus("Something went wrong loading cats. Please try again.");
  }
}

async function handleSearch(event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  const requestId = ++latestRequestId;
  try {
    setStatus(`Searching for "${query}"…`);
    const breeds = await searchBreeds(query);
    if (requestId !== latestRequestId) return;

    if (!breeds.length) {
      renderCats([]);
      setStatus(`No breed found matching "${query}".`);
      return;
    }

    const breed = breeds[0];
    const images = await getImagesByBreed(breed.id, 9);
    if (requestId !== latestRequestId) return;

    renderCats(images, { fallbackBreed: breed.name, favoriteImageIds: favoriteImageIds() });
    setStatus(`Showing ${breed.name} cats.`);
  } catch (error) {
    console.error(error);
    setStatus("Something went wrong with the search. Please try again.");
  }
}

async function showFavorites() {
  const requestId = ++latestRequestId;
  try {
    setStatus("Loading your favorites…");
    const favorites = await getFavorites();
    if (requestId !== latestRequestId) return;

    favoritesMap.clear();
    for (const fav of favorites) favoritesMap.set(fav.image_id, fav.id);

    const cats = favorites.map((fav) => ({ id: fav.image_id, url: fav.image.url }));
    renderCats(cats, { favoriteImageIds: favoriteImageIds() });
    setStatus(cats.length ? "Your favorite cats:" : "No favorites yet — go save some!");
  } catch (error) {
    console.error(error);
    setStatus("Couldn't load your favorites. Please try again.");
  }
}

async function handleGalleryClick(event) {
  const favBtn = event.target.closest(".fav-button");
  if (!favBtn) return;

  const imageId = favBtn.dataset.imageId;
  favBtn.disabled = true;

  try {
    if (favoritesMap.has(imageId)) {
      await removeFavorite(favoritesMap.get(imageId));
      favoritesMap.delete(imageId);
      favBtn.classList.remove("is-favorite");
    } else {
      const result = await addFavorite(imageId);
      favoritesMap.set(imageId, result.id);
      favBtn.classList.add("is-favorite");
    }
  } catch (error) {
    console.error("Couldn't update favorite:", error);
    setStatus("Couldn't update that favorite. Please try again.");
  } finally {
    favBtn.disabled = false;
  }
}

randomBtn.addEventListener("click", loadRandomCats);
searchForm.addEventListener("submit", handleSearch);
favoritesBtn.addEventListener("click", showFavorites);
onGalleryClick(handleGalleryClick);

(async function init() {
  await loadFavoritesIndex();
  await loadRandomCats();
})();