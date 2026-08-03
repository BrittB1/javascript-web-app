export const BASE_URL = "https://api.thecatapi.com/v1";
export const API_KEY = "REPLACE_WITH_YOUR_KEY";

export async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

export function getRandomCats(limit = 9) {
  return request(`/images/search?limit=${limit}&has_breeds=1`);
}

export function searchBreeds(query) {
  return request(`/breeds/search?q=${encodeURIComponent(query)}`);
}

export function getImagesByBreed(breedId, limit = 9) {
  return request(`/images/search?breed_ids=${breedId}&limit=${limit}`);
}