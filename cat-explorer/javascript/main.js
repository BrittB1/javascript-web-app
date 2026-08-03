import { getRandomCats, searchBreeds, getImagesByBreed } from "./api.js";
import { renderCats, setStatus } from "./ui.js";

const randomBtn = document.querySelector("#cat-randomizer");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");

let latestRequestId = 0;

async function loadRandomCats() {
  const requestId = ++latestRequestId;
  try {
    setStatus("Loading cats…");
    const cats = await getRandomCats(9);
    if (requestId !== latestRequestId) return;
    renderCats(cats);
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

    renderCats(images, { fallbackBreed: breed.name });
    setStatus(`Showing ${breed.name} cats.`);
  } catch (error) {
    console.error(error);
    setStatus("Something went wrong with the search. Please try again.");
  }
}

randomBtn.addEventListener("click", loadRandomCats);
searchForm.addEventListener("submit", handleSearch);

loadRandomCats();