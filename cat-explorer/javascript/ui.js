const gallery = document.querySelector("#gallery");
const status = document.querySelector("#status");

export function setStatus(message) {
    status.textContent = message;
}

function createCatCard(cat, { fallbackBreed = null, isFavorite = false } = {}) {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = cat.url;
    img.alt = "A cat";
    img.loading = "lazy";

    const name = document.createElement("p");
    name.className = "breed";
    name.textContent = cat.breeds?.[0]?.name ?? fallbackBreed ?? "Unknown breed";

    const favBtn = document.createElement("button");
    favBtn.className = isFavorite ? "fav-button is-favorite" : "fav-button";
    favBtn.type = "button";
    favBtn.dataset.imageId = cat.id;
    favBtn.setAttribute("aria-label", "Toggle favorite");

    const pawImg = document.createElement("img");
    pawImg.src = "images/paw-button.png";
    pawImg.alt = "";
    favBtn.append(pawImg);

    card.append(img, name, favBtn);
    return card;
}

export function renderCats(cats, options = {}) {
    const { fallbackBreed = null, favoriteImageIds = new Set() } = options;
    gallery.innerHTML = "";
    if (!cats.length) return;
    const cards = cats.map((cat) =>
        createCatCard(cat, { fallbackBreed, isFavorite: favoriteImageIds.has(cat.id) })
    );
    gallery.append(...cards);
}

export function onGalleryClick(handler) {
    gallery.addEventListener("click", handler);
}