import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { RES_PER_PAGE, MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
/* 
if(module.hot){
  module.hot.accept();
} */

// https://forkify-api.herokuapp.com/v2

const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const controlRecipes = async function () {
  try {
    //id
    const id = window.location.hash.slice(1);
    if (!id) return;

    //update results view to mark selected
    const start = (state.search.page - 1) * RES_PER_PAGE;
    const end = state.search.page * RES_PER_PAGE;

    resultsView.update(state.search.results.slice(start, end));

    //rendering initial pagination buttons
    paginationView.render(state.search);
    //updating bookmarks view
    bookmarksView.update(state.bookmarks);
    //rendering spinner
    recipeView.renderSpinner();

    // load recipe
    const state1 = await model.loadRecipe(id);
    state.recipe = state1.recipe;
    if (!state1) throw new Error(`💥💥💥`);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    // rendering recipe
    recipeView.render(state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function (page = state.search.page) {
  try {
    state.search.page = page;
    //Rendering spinner reslults
    resultsView.renderSpinner();

    //1)Get search query
    const query = searchView.getQuery();
    state.search.query = query;
    if (!query) return;

    // 2) Load search results
    const state2 = await model.loadSearchResults(query);
    state.search = state2.search;
    state.search.page = 1;

    const start = (page - 1) * RES_PER_PAGE;
    const end = page * RES_PER_PAGE;
    //rendering search results
    resultsView.render(state.search.results.slice(start, end));

    //rendering initial pagination buttons
    paginationView.render(state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //Render new results
  state.search.page = goToPage;
  const start = (goToPage - 1) * RES_PER_PAGE;
  const end = goToPage * RES_PER_PAGE;

  resultsView.render(state.search.results.slice(start, end));

  //rendering new pagination buttons
  paginationView.render(state.search);
  console.log(state.recipe);
};

controlServings = function (newServings) {
  //update recipe servings
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;

  //update recipeView
  recipeView.update(state.recipe);
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const addBookmark = function (recipe) {
  //adding bookmark
  state.bookmarks.push(recipe);

  //marking recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //marking recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const controlAddBookmark = function () {
  //add or remove bookmarks
  if (!state.recipe.bookmarked) {
    addBookmark(state.recipe);
  } else if (state.recipe.bookmarked) {
    deleteBookmark(state.recipe.id);
  }

  //updating recipe view
  recipeView.update(state.recipe);

  //render bookmarks
  bookmarksView.render(state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload recipe data
    const state3 = await model.uploadRecipe(newRecipe);
    state.recipe = state3.recipe;
    addBookmark(state.recipe);
    console.log(state);

    //render uploaded recipe
    recipeView.render(state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(state.bookmarks);

    //close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💔', err);
    addRecipeView.renderError(err.message);
  }
};

const initData = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

const init = function () {
  initData();
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  window.location.hash = '';
};
init();
