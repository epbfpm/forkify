// import icons from 'url:../img/icons.svg';
// import * as model from './model.js';
// import recipeView from './views/recipeView.js';
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// /* ============ selectors =========== */
// const select = selector => document.querySelector(selector);
// const recipeContainer = select('.recipe');
// const searchResultsContainer = select('.results');
// const paginationButtons = select('.pagination');
// const searchField = select('.search__field');
// const searchButton = select('.search__btn');
// const bookmarksList = select('.bookmarks__list');
// let bookmarks = new Map();
// let results;
// let currentPage = 1;

// const init = () => {
//   /* == search button event listener == */
//   searchButton?.addEventListener('click', e => {
//     e.preventDefault();

//     let query = searchField.value;
//     search(query);
//   });
//   search('pizza');

//   /* ========== render recipe ========= */

//   ['hashchange', 'load'].forEach(ev =>
//     window.addEventListener(ev, controlRecipes)
//   );

//   /* ===== get bookmarks from file ==== */
//   bookmarkRetrieval();

//   /* ======= pagination handler ======= */
//   paginationButtons.addEventListener('click', e => {
//     e.preventDefault();
//     const target = e.target;
//     target.innerHTML === `Page ${currentPage + 1}` && ++currentPage;
//     target.innerHTML === `Page ${currentPage - 1}` && --currentPage;
//     sidePanelHandler();
//   });
// };

// /* ================================== */
// /*        INCIDENTAL FUNCTIONS        */
// /* ================================== */
// const renderSpinner = function (parentEl) {
//   const markup = `<div class="spinner">
//           <svg>
//             <use href="${icons}#icon-loader"></use>
//           </svg>
//         </div>`;
//   parentEl.innerHTML = markup;
// };

// const noRecipeFound = function () {
//   const markup = `<div class="error">
//           <div>
//             <svg>
//               <use href="${icons}#icon-alert-triangle"></use>
//             </svg>
//           </div>
//           <p>No recipes found for your query. Please try again!</p>
//         </div>`;
//   recipeContainer.innerHTML = markup;
// };

// const throwError = function (res, data) {
//   if (!res.ok) throw new Error(`${data.message} (${res.status})`);
// };

// /* ================================== */
// /*         SEARCH AND PREVIEw         */
// /* ================================== */
// const search = async function (query) {
//   /* === clicking the search button === */
//   try {
//     renderSpinner(searchResultsContainer);

//     /* ===== fetching search results ==== */
//     const res = await fetch(
//       `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`
//     );
//     const data = await res.json();

//     /* === what if no recipe is found === */
//     if (data.results === 0) {
//       noRecipeFound();
//     }

//     /* ======== error collection ======== */
//     throwError(res, data);
//     let [...searchResults] = data.data.recipes;
//     results = searchResults;
//     sidePanelHandler();
//   } catch (err) {
//     alert(err);
//   }
// };

// const sidePanelHandler = function () {
//   let start = currentPage * 10 - 10;
//   let end = currentPage * 10;

//   displayPreview(start, end, results);
//   paginationHTML(currentPage);
// };

// const displayPreview = function (start, end, searchResults) {
//   searchResultsContainer.innerHTML = searchResults
//     .map(recipe => {
//       recipe = {
//         id: recipe.id,
//         title: recipe.title,
//         publisher: recipe.publisher,
//         sourceUrl: recipe.source_url,
//         image: recipe.image_url,
//         servings: recipe.servings,
//         cookingTime: recipe.cooking_time,
//         ingredients: recipe.ingredients,
//       };
//       return previewHTML(recipe);
//     })
//     .slice(start, end)
//     .join('');
// };

// const previewHTML = recipe => {
//   return `<li class="preview">
//             <a class="preview__link" href="#/${recipe.id}"  >
//               <figure class="preview__fig">
//                 <img src="${recipe.image}" alt="Test" />
//               </figure>
//               <div class="preview__data">
//                 <h4 class="preview__title">${recipe.title}</h4>
//                 <p class="preview__publisher">${recipe.publisher}</p>
//                 <div class="preview__user-generated">
//                   <svg>
//                     <use href="${icons}#icon-user"></use>
//                   </svg>
//                 </div>
//               </div>
//             </a>
//           </li>`;
// };

// /* =========== PAGINATION =========== */
// const paginationHTML = function (currentPage) {
//   let paginationHTML = `
//   <button class="btn--inline pagination__btn--prev ${
//     currentPage === 1 ? 'hidden' : ''
//   }">
//     <svg class="search__icon ">
//       <use href="${icons}#icon-arrow-left"></use>
//     </svg>
//     <span>Page ${currentPage - 1}</span>
//   </button>
//   <button class="btn--inline pagination__btn--next ${
//     currentPage * 10 >= results.length ? 'hidden' : ''
//   }">
//     <span>Page ${currentPage + 1}</span>
//     <svg class="search__icon">
//       <use href="${icons}#icon-arrow-right"></use>
//     </svg>
//   </button>`;
//   paginationButtons.innerHTML = paginationHTML;
// };

// /* ================================== */
// /*           DISPLAY RECIPE           */
// /* ================================== */
// const controlRecipes = async function (e) {
//   try {
//     e.preventDefault();
//     window.scrollTo({ top: 0, behavior: 'smooth' });

//     /* ============= get id ============= */
//     const id = window.location.hash.slice(1);
//     if (!id) return;

//     /* =========== load recipe ========== */
//     await model.loadRecipe(id);
//     const { recipe } = model.state;

//     /* ======== change active tag ======= */
//     const target = select(`[href="#${id}"]`); // find target
//     const activeTag = select('.preview__link--active');
//     activeTag && activeTag.classList.remove('preview__link--active');
//     target?.classList.add('preview__link--active'); // add tag

//     /* ===== call related functions ===== */
//     renderSpinner(recipeContainer);

//     /* ========== render recipe ========= */
//     recipeView.render(model.state.recipe);

//     changeServings(recipe);
//     bookmarkHandler(recipe);
//   } catch (err) {
//     alert(err);
//   }
// };

// /* ====== change serving sizes ====== */
// const changeServings = function (r) {
//   const changeServingButtons = select('.recipe__info-buttons');

//   changeServingButtons.addEventListener('click', e => {
//     e.preventDefault();

//     const lowerServingsBtn = e.target
//       .closest('.btn--tiny')
//       .classList.contains('btn--decrease-servings');

//     let prevServings = r.servings;

//     r.servings == 1 && lowerServingsBtn
//       ? r.servings
//       : (r.servings += lowerServingsBtn ? -1 : +1);

//     r.ingredients.forEach(i => {
//       i.quantity =
//         (i.quantity ?? '') && (i.quantity * r.servings) / prevServings;
//     });

//     recipeHTML(r);
//   });
// };

// /* ================================== */
// /*              BOOKMARKS             */
// /* ================================== */
// const bookmarkRetrieval = function () {
//   const noBookmarks = `<div class="message">
//                     <div>
//                       <svg>
//                         <use href="${icons}#icon-smile"></use>
//                       </svg>
//                     </div>
//                     <p>
//                       No bookmarks yet. Find a nice recipe and bookmark it :)
//                     </p>
//                   </div>
//                   `;

//   const lsb = new Map();
//   const x = localStorage.getItem('bookmarks');

//   if (x) {
//     const data = JSON.parse(x);
//     for (const [id, b] of data) {
//       lsb.set(id, b);
//     }
//     bookmarks = lsb;
//   }

//   if (bookmarks.size === 0) {
//     bookmarksList.innerHTML = noBookmarks;
//   } else {
//     bookmarksList.innerHTML = [...bookmarks.values()]
//       .map(b => previewHTML(b))
//       .join('');
//   }
// };

// const bookmarkHandler = function (recipe) {
//   const bookmarkBtn = select('.btn--bookmark');

//   bookmarkBtn.addEventListener('click', e => {
//     e.preventDefault();

//     bookmarks.has(recipe.id)
//       ? bookmarks.delete(recipe.id)
//       : bookmarks.set(recipe.id, recipe);

//     /* === Update localStorage === */
//     const bookmarksArray = Array.from(bookmarks.entries());
//     localStorage.setItem('bookmarks', JSON.stringify(bookmarksArray));

//     /* === add/remove no-bookmarks msg == */
//     bookmarkRetrieval();

//     /* == bookmarksList event listener == */
//     bookmarksList.addEventListener('click', () => {
//       recipeHTML(recipe);
//     });
//   });
// };

// init();
