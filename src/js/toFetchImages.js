import axios from 'axios';
export const toFetchImages = async (querySearch, page, perPage) => {
  const BASE_URL = 'https://pixabay.com/api/';
  const params = new URLSearchParams({
    key: '37713540-617e3e53817eb581a56de069f',
    q: querySearch,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
  });
  const response = await axios.get(`${BASE_URL}?${params.toString()}`);
  return response;
};
