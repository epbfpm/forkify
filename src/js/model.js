import icons from 'url:../img/icons.svg';

export const state = {
  recipe: {},
  searchResults: [],
  bookmarks: {},
};

const throwError = function (res, data) {
  if (!res.ok) throw new Error(`${data.message} (${res.status})`);
};

export const loadRecipe = async function (id) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await res.json();

    throwError(res, data);

    const { recipe } = data.data;
    state.recipe = constructRecipeObj(recipe);
  } catch (err) {
    alert(err);
  }
};

export const loadSearch = async function (query) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`
    );
    const data = await res.json();

    throwError(res, data);

    state.searchResults = [...data.data.recipes].map(recipe => {
      return constructRecipeObj(recipe);
    });
  } catch (err) {
    console.log(err);
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
