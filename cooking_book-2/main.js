// STEP 2: Import recipes (using the filename you provided)
import recipes from './recipes.mjs';

// --- Helper Functions (Steps 2 & 3) ---

/**
 * Generates a random whole number between 0 and (num - 1).
 * @param {number} num - The upper bound (exclusive).
 * @returns {number} A random whole number.
 */
function random(num) {
  return Math.floor(Math.random() * num);
}

/**
 *Picks a random item from a list.
 * @param {Array} list - The list to pick from.
 * @returns {*} A random item from the list.
 */
function getRandomListEntry(list) {
  const listLength = list.length;
  const randomNum = random(listLength);
  return list[randomNum];
}

/**
 * Creates HTML list items for recipe tags.
 * @param {Array<string>} tags - A list of tags.
 * @returns {string} HTML string of <li> elements.
 */
function tagsTemplate(tags) {
  return tags.map(tag => `<li>${tag}</li>`).join('');
}

/**
 * Creates HTML for the star rating display.
 * @param {number} rating - The recipe's rating (e.g., 4.5).
 * @returns {string} HTML string for the rating.
 */
function ratingTemplate(rating) {
  let html = `<span
    class="rating"
    role="img"
    aria-label="Rating: ${rating} out of 5 stars"
  >`;
  
  // Create 5 stars
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      // Filled star
      html += `<span aria-hidden="true" class="icon-star">⭐</span>`;
    } else {
      // Empty star
      html += `<span aria-hidden="true" class="icon-star-empty">☆</span>`;
    }
  }
  
  html += `</span>`;
  return html;
}

/**
 * Creates the complete HTML for a single recipe <figure>.
 * @param {object} recipe - The recipe object.
 * @returns {string} HTML string for one recipe card.
 */
function recipeTemplate(recipe) {
  return `<figure class="recipe">
    <img src="${recipe.image}" alt="Image of ${recipe.name}" />
    <figcaption>
      <ul class="recipe__tags">
        ${tagsTemplate(recipe.tags)}
      </ul>
      <h2><a href="#">${recipe.name}</a></h2>
      <p class="recipe__ratings">
        ${ratingTemplate(recipe.rating)}
      </p>
      <p class="recipe__description">
        ${recipe.description}
      </p>
    </figcaption>
  </figure>`;
}

// --- Main Functions (Steps 4 & 5) ---

/**
 * Renders a list of recipes to the page.
 * @param {Array<object>} recipeList - A list of recipe objects to display.
 */
function renderRecipes(recipeList) {
  // Get the output element from cooking.html
  const outputElement = document.getElementById('recipes');
  
  // Transform recipe objects into HTML strings
  const htmlStrings = recipeList.map(recipe => recipeTemplate(recipe)).join('');
  
  // Set the HTML
  outputElement.innerHTML = htmlStrings;
}

/**
 * Filters the main recipes list based on a query.
 * @param {string} query - The lowercase search term.
 * @returns {Array<object>} A sorted list of matching recipes.
 */
function filterRecipes(query) {
  const filtered = recipes.filter(recipe => {
    // Check name, description, tags, and ingredients
    // Note: Using 'recipeIngredient' to match your recipes.mjs file
    return (
      recipe.name.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.tags.find(item => item.toLowerCase().includes(query)) ||
      recipe.recipeIngredient.find(item => item.toLowerCase().includes(query))
    );
  });
  
  // Sort the filtered list alphabetically by name
  const sorted = filtered.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  
  return sorted;
}

/**
 * Handles the search form submission.
 * @param {Event} e - The form submission event.
 */
function searchHandler(e) {
  e.preventDefault();
  
  // Get the search input element from cooking.html
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.toLowerCase();
  
  // Filter and render the recipes
  const filteredList = filterRecipes(query);
  renderRecipes(filteredList);
}

/**
 * Initializes the page: loads one random recipe.
 */
function init() {
  // Get a random recipe
  const recipe = getRandomListEntry(recipes);
  // Render it
  renderRecipes([recipe]);
}

// --- Event Listeners ---

// Run init() when the page is loaded
document.addEventListener('DOMContentLoaded', init);

// Add listener to the search form from cooking.html
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', searchHandler);