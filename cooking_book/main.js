import recipes from "./recipes.mjs"; // FIX 1: Changed to default import

document.addEventListener('DOMContentLoaded', () => {
  const recipeContainer = document.getElementById('recipes');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  function displayRecipes(list) {
    recipeContainer.innerHTML = '';

    list.forEach(recipe => {
      const card = document.createElement('div');
      card.classList.add('recipe-card');

      // FIX 2: Changed .ingredients to .recipeIngredient and .instructions to .recipeInstructions
      card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}">
        <h2>${recipe.name}</h2>
        <p>${recipe.description}</p>
        <h4>Ingredients:</h4>
        <ul>${recipe.recipeIngredient.map(i => `<li>${i}</li>`).join('')}</ul>
        <h4>Instructions:</h4>
        <ol>${recipe.recipeInstructions.map(step => `<li>${step}</li>`).join('')}</ol>
      `;

      recipeContainer.appendChild(card);
    });
  }

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const term = searchInput.value.toLowerCase();

    const filtered = recipes.filter(r =>
      r.name.toLowerCase().includes(term) ||
      // FIX 2: Changed .ingredients to .recipeIngredient
      r.recipeIngredient.some(i => i.toLowerCase().includes(term))
    );

    displayRecipes(filtered);
  });

  displayRecipes(recipes);
});