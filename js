// Get DOM elements
const form = document.querySelector('form');
const recipeList = document.querySelector('#recipe-list');
const noRecipes = document.getElementById('no-recipes');
const searchBox = document.getElementById('search-box');
const addEditButton = document.getElementById('add-edit-button');

// Define recipes array
let recipes = [];

// Handle form submit
function handleSubmit(event) {
  event.preventDefault();
  
  const nameInput = document.querySelector('#recipe-name');
  const ingrInput = document.querySelector('#recipe-ingredients');
  const methodInput = document.querySelector('#recipe-method');
  const name = nameInput.value.trim();
  const ingredients = ingrInput.value.trim().split(',').map(i => i.trim());
  const method = methodInput.value.trim();
  
  if (name && ingredients.length > 0 && method) {
    // Check if it's an edit or add operation
    const editIndex = addEditButton.dataset.index;
    if (editIndex !== undefined) {
      // Editing an existing recipe
      recipes[editIndex] = { name, ingredients, method };
      addEditButton.textContent = 'Add Recipe'; // Change the button text back to "Add Recipe"
      addEditButton.removeAttribute('data-index'); // Remove the data-index attribute
    } else {
      // Adding a new recipe
      recipes.push({ name, ingredients, method });
    }
    
    nameInput.value = '';
    ingrInput.value = '';
    methodInput.value = '';
    displayRecipes();
  }
}

// Display recipes in recipe list
function displayRecipes() {
  recipeList.innerHTML = '';
  recipes.forEach((recipe, index) => {
    const recipeDiv = document.createElement('div');
    recipeDiv.innerHTML = `
      <h3>${recipe.name}</h3>
      <button class="edit-button" data-index="${index}">Edit</button>
      <button class="delete-button" data-index="${index}">Delete</button>`;
    recipeDiv.classList.add('recipe');
    recipeList.appendChild(recipeDiv);
  });
  if (recipes.length > 0) {
    noRecipes.style.display = 'none';
  } else {
    noRecipes.style.display = 'flex';
  }
}

// Handle recipe deletion
function handleDelete(event) {
  if (event.target.classList.contains('delete-button')) {
    const index = event.target.dataset.index;
    recipes.splice(index, 1);
    displayRecipes();
    searchBox.value = '';
  }
}

// Handle recipe editing
function handleEdit(event) {
  if (event.target.classList.contains('edit-button')) {
    const index = event.target.dataset.index;
    const editedRecipe = recipes[index];
    
    const nameInput = document.querySelector('#recipe-name');
    const ingrInput = document.querySelector('#recipe-ingredients');
    const methodInput = document.querySelector('#recipe-method');
    
    nameInput.value = editedRecipe.name;
    ingrInput.value = editedRecipe.ingredients.join(', ');
    methodInput.value = editedRecipe.method;
    
    addEditButton.textContent = 'Edit Recipe';
    addEditButton.setAttribute('data-index', index);
  }
}

// Search recipes by search query
function search(query) {
  const filteredRecipes = recipes.filter(recipe => {
    return recipe.name.toLowerCase().includes(query.toLowerCase());
  });
  displayRecipes(filteredRecipes);
}

// Add event listeners
form.addEventListener('submit', handleSubmit);
recipeList.addEventListener('click', handleDelete);
recipeList.addEventListener('click', handleEdit);
searchBox.addEventListener('input', event => search(event.target.value));
