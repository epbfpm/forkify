import icons from 'url:../img/icons.svg';
import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

// sei lá brother
/* ============ selectors =========== */
const select = selector => document.querySelector(selector);

/* ================================== */
/*                INIT                */
/* ================================== */
const init = () => {
  searchView.addSearchHandler(controlSearch);
  recipeView.addLoadHandler(controlRecipes);
  recipeView.addServingsHandler(controlServings);
  recipeView.addBookmarksHandler(controlBookmarks);
  paginationView.addPaginationHandler(controlPagination);
};

/* ================================== */
/*        INCIDENTAL FUNCTIONS        */
/* ================================== */
const changeActiveTag = id => {
  /* ======== change active tag ======= */
  const target = select(`[href="#${id}"]`); // find target
  const activeTag = select('.preview__link--active');
  activeTag && activeTag.classList.remove('preview__link--active');
  target?.classList.add('preview__link--active'); // add tag
};

/* ================================== */
/*         SEARCH AND PREVIEw         */
/* ================================== */
const controlSearch = async function () {
  try {
    resultsView.renderSpinner();

    /* ======= fetch search results ====== */
    await model.loadSearch(searchView.getQuery());
    if (!searchView.getQuery()) return;

    /* ====== render search results ===== */
    resultsView.render(model.state.searchResults);
    paginationView.render(1, model.state.searchResults);
  } catch (err) {
    console.log(`💔${err}`);
    resultsView.renderError(err);
  }
};

/* ================================== */
/*             PAGINATION             */
/* ================================== */
const controlPagination = function (currentPage) {
  paginationView.render(currentPage, model.state.searchResults.length);
  resultsView.renderNewPage(currentPage);
  resultsView.render(model.state.searchResults);
};

/* ================================== */
/*           DISPLAY RECIPE           */
/* ================================== */
const controlRecipes = async function () {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    /* ============= get id ============= */
    const id = window.location.hash.slice(1);
    if (!id) return;

    /* ========= render spinner ========= */
    recipeView.renderSpinner();

    /* =========== load recipe ========== */
    await model.loadRecipe(id);
    const { recipe } = model.state;

    changeActiveTag(id);

    /* ========== render recipe ========= */
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(`💔${err}`);
    recipeView.renderError(err);
  }
};

/* ====== change serving sizes ====== */
const controlServings = function (modifyServings) {
  model.updateServings(modifyServings);

  recipeView.renderIngredients(model.state.recipe);
};

/* ================================== */
/*              BOOKMARKS             */
/* ================================== */
(function () {
  model.retrieveBookmarksFromLS();
  bookmarksView.render(model.state.bookmarks);
})();

const controlBookmarks = function () {
  model.state.bookmarks.has(model.state.recipe.id)
    ? model.deleteBookmark()
    : model.addBookmark();

  bookmarksView.render(model.state.bookmarks);
};

init();
