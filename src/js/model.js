import { API_URL, KEY } from './config.js';
import { AJAX } from './helpers';
import { RES_PER_PAGE } from './config.js';

export const loadRecipe = async function (id) {
  try {
    const state = { recipe: {} };
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    let { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && { key: recipe.key }),
    };

    return state;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const state = {
      search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
      },
    };

    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    const { recipes } = data.data;
    state.search.results = recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    return state;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const state = { recipe: {} };
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format! Please use correct format!'
          );
        }
        const [quantity = quantity ? +quantity : null, unit, description] =
          ingArr;
        return { quantity, unit, description };
      });

    const recipe1 = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe1);
    let { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && { key: recipe.key }),
    };

    return state;
  } catch (err) {
    throw err;
  }
};
