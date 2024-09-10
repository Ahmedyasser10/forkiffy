import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultView.update(model.getSearchResultsPage());
    // debugger;
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    console.log(model.state.search.results);
    resultView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (page) {
  resultView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};
const controServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlToggleBookmark = function () {
  model.toggleBookmarks();
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlUpload = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', model.state.recipe.id);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    setTimeout(function () {
      location.reload();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controServings);
  recipeView.addHandlerAddBookmark(controlToggleBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerRender(controlPagination);
  addRecipeView.addHandlerUpload(controlUpload);
};

init();
