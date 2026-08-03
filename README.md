# 🐾 Cat Explorer

A single-page web app for browsing cats, searching by breed, and saving your
favorites — built with vanilla JavaScript, HTML, and CSS in a Frutiger Aero style.

## Features

- **Random gallery** — pull up a fresh batch of random cats with one click
- **Breed search** — search for cats by breed name (e.g. Bengal, Siamese)
- **Favorites** — save cats with the paw button and view them anytime; favorites
  persist across page refreshes because they're stored through the API

## Built with

- Vanilla JavaScript — ES modules, `fetch`, and async/await
- [The Cat API](https://thecatapi.com) for all cat data
- HTML and CSS — CSS Grid, Flexbox, glassmorphism, and custom animations

## Running it locally

1. Get a free API key at [thecatapi.com](https://thecatapi.com) and add it to
   the `API_KEY` value in `javascript/api.js`.
2. Open `index.html` with a local server (such as VS Code's Live Server).
   The app uses ES modules, which require `http://` — opening the file directly
   from your file system will not work.

## Project structure

- `index.html` — page structure and the empty containers the app fills at runtime
- `styling.css` — all styling and animations
- `javascript/api.js` — fetch calls to The Cat API (GET) plus a shared request helper
- `javascript/favorites.js` — saving and removing favorites (POST and DELETE)
- `javascript/ui.js` — building and rendering cat cards in the DOM
- `javascript/main.js` — entry point; wires up events and coordinates the modules

## How it works

`main.js` imports functions from the other three modules, listens for clicks and
form submissions, calls the API, and passes the results to the UI to render.
Each cat is displayed as a card with a paw button that toggles it as a favorite.

To keep the app responsive and correct, requests use a latest-request-wins guard
so a slow response can't overwrite a newer one, and each favorite button disables
itself while its request is in flight to prevent duplicate submissions.
