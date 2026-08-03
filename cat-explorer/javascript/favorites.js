import { request } from "./api.js";

const SUB_ID = "cat-explorer-britt";

export function addFavorite(imageId) {
  return request("/favourites", {
    method: "POST",
    body: JSON.stringify({ image_id: imageId, sub_id: SUB_ID }),
  });
}

export function removeFavorite(favouriteId) {
  return request(`/favourites/${favouriteId}`, { method: "DELETE" });
}

export function getFavorites() {
  return request(`/favourites?sub_id=${SUB_ID}`);
}