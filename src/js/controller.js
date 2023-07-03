import icons from 'url:../img/icons.svg';
import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// sei lá brother
/* ============ selectors =========== */
const select = selector => document.querySelector(selector);
const recipeContainer = select('.recipe');

const init = () => {
  searchView.addSearchHandler(controlSearch);

  recipeView.addLoadHandler(controlRecipes);

  paginationView.addPaginationHandler(controlPagination);

  /* ===== get bookmarks from file ==== */
  // bookmarkRetrieval();

  // controlSearch(); // ⚠️ ONLY TO MAKE PIZZAS APPEAR REMOVE

  /* ======= pagination handler ======= */
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
    paginationView.render(1, 100);
    resultsView.render(model.state.searchResults);
  } catch (err) {
    // alert(err);
    console.log(err);
  }
};

/* ================================== */
/*             PAGINATION             */
/* ================================== */
const controlPagination = function (currentPage) {
  paginationView.render(currentPage, model.state.searchResults.length);
  // if (!searchView.getQuery()) return;
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

    /* ===== call related functions ===== */
    // changeServings(recipe);
    // bookmarkHandler(recipe);
  } catch (err) {
    // alert(err);
    console.log(err);
  }
};

/* ====== change serving sizes ====== */
const changeServings = function (r) {
  try {
    recipeContainer.addEventListener('click', e => {
      /* === is target the minus button === */
      if (!e.target.closest('.btn--tiny')) return;
      const lowerServingsBtn = e.target
        .closest('.btn--tiny')
        .classList.contains('btn--decrease-servings');

      /* ======= save previous value ====== */
      let prevServings = r.servings;

      /* ====== minimum serving is 1 ====== */
      r.servings == 1 && lowerServingsBtn
        ? r.servings
        : (r.servings += lowerServingsBtn ? -1 : +1);

      r.ingredients.forEach(i => {
        i.quantity = i.quantity ? (i.quantity * r.servings) / prevServings : 0;
      });

      recipeView.render(r);
    });
  } catch (err) {
    console.log(err);
  }
};

/* ================================== */
/*              BOOKMARKS             */
/* ================================== */
const bookmarksList = select('.bookmarks__list');
let bookmarks = new Map();
const bookmarkRetrieval = function () {
  const noBookmarks = `<div class="message">
                    <div>
                      <svg>
                        <use href="${icons}#icon-smile"></use>
                      </svg>
                    </div>
                    <p>
                      No bookmarks yet. Find a nice recipe and bookmark it :)
                    </p>
                  </div>
                  `;

  const lsb = new Map();
  const x = localStorage.getItem('bookmarks');

  if (x) {
    const data = JSON.parse(x);
    for (const [id, b] of data) {
      lsb.set(id, b);
    }
    bookmarks = lsb;
  }

  if (bookmarks.size === 0) {
    bookmarksList.innerHTML = noBookmarks;
  } else {
    bookmarksList.innerHTML = [...bookmarks.values()]
      .map(b => previewHTML(b))
      .join('');
  }
};

const bookmarkHandler = function (recipe) {
  recipeContainer.addEventListener('click', e => {
    e.preventDefault();
    if (!e.target.closest('button')?.classList.contains('btn--bookmark'))
      return;

    bookmarks.has(recipe.id)
      ? bookmarks.delete(recipe.id)
      : bookmarks.set(recipe.id, recipe);

    /* === Update localStorage === */
    const bookmarksArray = Array.from(bookmarks.entries());
    localStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));

    /* === add/remove no-bookmarks msg == */
    bookmarkRetrieval();

    /* == bookmarksList event listener == */
    bookmarksList.addEventListener('click', () => {
      recipeView.render(recipe);
    });
  });
};

init();
