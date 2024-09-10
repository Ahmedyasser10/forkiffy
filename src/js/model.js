import { async } from 'regenerator-runtime';
import { APT_URL, PAGE_SIZE, KEY } from './config.js';
import { AJAX } from './helper.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultPerPage: PAGE_SIZE,
    page: 1,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: `#${recipe.id}`,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${APT_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.find(bm => bm.id === state.recipe.id)) {
      state.recipe.bookmark = true;
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${APT_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: `#${rec.id}`,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;
  state.search.page = page;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  const { servings } = state.recipe;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / servings;
  });
  state.recipe.servings = newServings;
};

const presistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const toggleBookmarks = function () {
  if (!state.recipe.bookmark) {
    state.recipe.bookmark = true;
    state.bookmarks.push(state.recipe);
  } else {
    state.recipe.bookmark = false;
    state.bookmarks.forEach((bm, i) => {
      if (bm.id === state.recipe.id) state.bookmarks.splice(i, 1);
    });
  }
  presistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(([key, value]) => key.startsWith('ingredient') && value != '')
      .map(([_, value]) => {
        const ingArr = value.split(',').map(x => x.trim());

        if (ingArr.length != 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    // console.log(ingredients);
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${APT_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    toggleBookmarks();
  } catch (err) {
    throw err;
  }
};
const init = function () {
  const storge = JSON.parse(localStorage.getItem('bookmarks'));
  if (storge) state.bookmarks = storge;
};
init();
