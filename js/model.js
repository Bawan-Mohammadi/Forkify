"use strict";
import { create } from "core-js/./es/object";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";
export const state = {
  //contains all the data about the APPLICATION
  recipe: {},
  search: { query: "", results: [], resultsPerPage: RES_PER_PAGE, page: 1 },
  bookmarks: [],
  uploadedRecipes: [],
};
const createRecipeObject = function (data) {
  //re format the object we get from logging the data
  const recipe = data.data.recipe;
  return (state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    //if we recipe.key is false the destructuring doesnt happen, if it's
    //otherwise, the second part is returned and we'll spread that and
    //it'll be like key: recipe.key
  });
};
export const loadRecipe = async function (id) {
  try {
    // 1. Check uploaded local recipes first
    const localRecipe =
      state.uploadedRecipes.find((recipe) => recipe.id === id) ||
      state.bookmarks.find(
        (recipe) => recipe.id === id && id.startsWith("local-"),
      );

    if (localRecipe) {
      state.recipe = localRecipe;

      state.recipe.bookmarked = state.bookmarks.some(
        (bookmark) => bookmark.id === id,
      );

      return;
    }

    // 2. If it is a local ID but not found, do NOT send it to Forkify
    if (id.startsWith("local-")) {
      throw new Error(
        "This local recipe was not found. It may have been removed from localStorage.",
      );
    }

    // 3. Only real Forkify IDs reach the API
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    state.recipe.bookmarked = state.bookmarks.some(
      (bookmark) => bookmark.id === id,
    );
  } catch (err) {
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    const apiResults = data.data.recipes.map((el) => {
      return {
        id: el.id,
        title: el.title,
        publisher: el.publisher,
        image: el.image_url,
      };
    });

    const localResults = state.uploadedRecipes
      .filter((recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase()),
      )
      .map((recipe) => {
        return {
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          image: recipe.image,
          key: recipe.key,
        };
      });

    state.search.results = [...localResults, ...apiResults];

    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;
  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //new quantity = old quantity * new servings / old servings
  });
  state.recipe.servings = newServings;
};
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};
const persistUploadedRecipes = function () {
  localStorage.setItem(
    "uploadedRecipes",
    JSON.stringify(state.uploadedRecipes),
  );
};
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

//when we add we want the entire data, when we delete we only want the id
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
    persistBookmarks();
  }
};

const getLocalStorage = function (storageKey, stateProperty) {
  const storage = localStorage.getItem(storageKey);

  if (storage) state[stateProperty] = JSON.parse(storage);
};
const init = function () {
  getLocalStorage("bookmarks", "bookmarks");
  getLocalStorage("uploadedRecipes", "uploadedRecipes");
};

init();
const addRecipeToSearchResults = function (recipe) {
  const previewRecipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image,
    key: recipe.key,
  };

  const alreadyExists = state.search.results.some(
    (result) => result.id === previewRecipe.id,
  );

  if (!alreadyExists) {
    state.search.results.unshift(previewRecipe);
  }

  state.search.page = 1;
};
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(([key, value]) => {
        return key.startsWith("ingredient") && value.trim() !== "";
      })
      .map(([_, value]) => {
        const ingArr = value.split(",").map((el) => el.trim());

        if (ingArr.length !== 3) {
          throw new Error(
            "Wrong ingredient format. Use: Quantity, Unit, Description",
          );
        }

        const [quantity, unit, description] = ingArr;

        if (!description) {
          throw new Error("Ingredient description cannot be empty.");
        }

        if (quantity && !Number.isFinite(+quantity)) {
          throw new Error("Ingredient quantity must be a number.");
        }

        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    try {
      const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

      state.recipe = createRecipeObject(data);
    } catch (err) {
      console.warn("API upload failed. Saving recipe locally instead.");

      state.recipe = {
        id: `local-${Date.now()}`,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceURL: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        bookmarked: false,
        key: KEY,
      };

      state.uploadedRecipes.push(state.recipe);
      persistUploadedRecipes();
    }

    addRecipeToSearchResults(state.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
