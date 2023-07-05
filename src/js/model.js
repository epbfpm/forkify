import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  searchResults: [],
  bookmarks: new Map(),
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;

    state.recipe = constructRecipeObj(recipe);
  } catch (err) {
    /* ======= temp error handling ====== */
    // alert(`${err} 💔`);
    throw err;
  }
};

export const loadSearch = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.searchResults = [...data.data.recipes].map(recipe => {
      return constructRecipeObj(recipe);
    });
  } catch (err) {
    /* ======= temp error handling ====== */
    // console.error(`${err} 💔`);
    throw err;
  }
};

export const constructRecipeObj = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    ogServings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
  };
};

export const updateServings = function (modifyServings) {
  /* ======= save previous value ====== */
  let prevServings = state.recipe.servings;

  /* ====== minimum serving is 1 ====== */
  state.recipe.servings == 1 && modifyServings === -1
    ? state.recipe.servings
    : (state.recipe.servings += modifyServings);

  state.recipe.ingredients.forEach(i => {
    i.quantity = i.quantity
      ? (i.quantity * state.recipe.servings) / prevServings
      : 0;
  });
};

export const addBookmark = function () {
  state.bookmarks.set(state.recipe.id, state.recipe);
  setBookmarksInLS();
};

export const deleteBookmark = function () {
  state.bookmarks.delete(state.recipe.id);
  setBookmarksInLS();
};

const setBookmarksInLS = function () {
  const bookmarksArray = Array.from(state.bookmarks.entries());
  localStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));
  console.log('LS', JSON.parse(localStorage.getItem('bookmarks')));
};

const clearBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify([]));
};

// clearBookmarks();

export const retrieveBookmarksFromLS = function () {
  const localStorageBookmarks = new Map();
  const getItems = localStorage.getItem('bookmarks');

  if (getItems) {
    const data = JSON.parse(getItems);
    for (const [id, b] of data) {
      localStorageBookmarks.set(id, b);
    }
    state.bookmarks = localStorageBookmarks;
  }
};
