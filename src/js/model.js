import { API_URL, RES_PER_PAGE, API_KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    querry: '',
    page: 1,
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: new Map(),
};

/* ================================== */
/*               SEARCH               */
/* ================================== */
export const loadSearch = async function (query) {
  try {
    state.search.querry = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = [...data.data.recipes].map(recipe => {
      return constructRecipeObj(recipe);
    });
    state.search.page = 1;
  } catch (err) {
    /* ======= temp error handling ====== */
    // console.error(`${err} 💔`);
    throw err;
  }
};

/* ================================== */
/*               RECIPE               */
/* ================================== */
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;
    state.recipe = constructRecipeObj(recipe);

    /* ===== add boookmarked status ===== */
    state.recipe.bookmarked = !!state.bookmarks.has(state.recipe.id);
  } catch (err) {
    /* ======= temp error handling ====== */
    // alert(`${err} 💔`);
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
    ...(recipe.key && { key: recipe.key }),
  };
};

/* ============= SERVINGS ============ */
export const updateServings = function (delta) {
  /* ======= save previous value ====== */
  let prevServings = state.recipe.servings;

  /* ====== minimum serving is 1 ====== */
  state.recipe.servings == 1 && delta === -1
    ? state.recipe.servings
    : (state.recipe.servings += delta);

  state.recipe.ingredients.forEach(i => {
    i.quantity = i.quantity
      ? (i.quantity * state.recipe.servings) / prevServings
      : 0;
  });
};

/* ================================== */
/*              BOOKMARKS             */
/* ================================== */
export const addBookmark = function () {
  state.bookmarks.set(state.recipe.id, state.recipe);
  state.recipe.bookmarked = true;
  setBookmarksInLS();
};

export const deleteBookmark = function () {
  state.bookmarks.delete(state.recipe.id);
  state.recipe.bookmarked = false;
  setBookmarksInLS();
};

const setBookmarksInLS = function () {
  const bookmarksArray = Array.from(state.bookmarks.entries());
  localStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));
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
      if (![id][0]) continue;

      localStorageBookmarks.set(id, b);
    }
    state.bookmarks = localStorageBookmarks;
  }
};

/* ================================== */
/*             PAGINATION             */
/* ================================== */
export const getResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

/* ================================== */
/*             ADD RECIPE             */
/* ================================== */
export const uploadRecipe = async function (data) {
  try {
    /* == professor code -newer methods = */
    // const dataArr = [...new FormData(this._parentEl)];
    // const dataObj = Object.fromEntries(dataArr);

    // TODO - redo using the above methods

    /* ======= get data from form ======= */
    const uploadData = {};

    data.forEach(i => {
      uploadData[i.name] = i.value;
    });

    /* ==== get ingredients in format === */
    const ingredients = [];
    const entries = Object.entries(uploadData);

    for (let index = 0; index < entries.length; index++) {
      let [key, value] = entries[index];

      if (!value.split(',')[2]) continue;
      value = value.split(',');
      if (value.length !== 3) throw new Error('Wrong ingredient format!');

      if (key.startsWith(`ing`)) {
        ingredients.push({
          quantity: +value[0] || '',
          unit: value[1] || '',
          description: value[2],
        });
      }
    }

    /* ===== construct recipe object ==== */
    const newRecipe = {
      id: '5ed6604591c37cdc054bcc13',
      title: uploadData['title'],
      publisher: uploadData['publisher'],
      source_url: uploadData['sourceUrl'],
      image_url: uploadData['image'],
      servings: uploadData['servings'],
      cooking_time: uploadData['cookingTime'],
      ingredients: ingredients,
    };

    // state.recipe = newRecipe;
    const sendRecipeResults = await sendJSON(
      `${API_URL}?key=${API_KEY}`,
      newRecipe
    );

    state.recipe = constructRecipeObj(sendRecipeResults.data.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const init = function () {
  retrieveBookmarksFromLS();
};

init();
