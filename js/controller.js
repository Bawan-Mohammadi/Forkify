//cotroller
"use strict";
import "core-js/stable";
import "regenerator-runtime/runtime";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import bookmarkModalView from "./views/bookmarkModalView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

if (module.hot) {
  module.hot.accept();
}
//loading recipe
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); //remove the hashtag
    if (!id) return;
    recipeView.renderSpinner();
    //update results view to mark selected seach results
    if (model.state.search.results.length > 0) {
      resultsView.update(model.getSearchResultsPage());
    }
    bookmarksView.update(model.state.bookmarks);
    //load recipe
    await model.loadRecipe(id); //async function returns a promise so we need to await it
    //rendering recipe
    recipeView.render(model.state.recipe); //stores the data and stores it in the object
  } catch (err) {
    console.error(err);
    recipeView.renderError();
    //by setting a default one in the view, we have nothing
    //messed up by having something related only to view here
  }
};
const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);

  } catch (err) {
    console.error(err);
  }
};
const controlPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultsPage(gotoPage));
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  model.updateServings(newServings);
  //just updates the part we want from the dom
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);
  //render bookmarks
  bookmarksView.render(model.state.bookmarks);

  const modal = document.querySelector(".bookmark-modal");
  modal.classList.toggle("delete", model.state.bookmarks.length === 0);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
  const modal = document.querySelector(".bookmark-modal");
  modal.classList.toggle("delete", model.state.bookmarks.length === 0);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    bookmarksView.render(model.state.bookmarks);
        resultsView.render(model.getSearchResultsPage(1));
        paginationView.render(model.state.search);

    addRecipeView.renderMessage();
//change id in the url without reloading, the first two don't really matter
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  resultsView.renderMessage();
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
