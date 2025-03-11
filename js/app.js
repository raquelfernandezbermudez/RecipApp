// API URL base
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Elementos del DOM
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const recipesContainer = document.getElementById('recipes-container');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const homeLink = document.getElementById('home-link');
const modalBody = document.getElementById('modalBody');
const modalTitle = document.getElementById('modalTitle');


// Instancia del modal de Bootstrap
let recipeModal;

// Definir la función en el ámbito global
function viewRecipe(recipeId) {
  showRecipeDetails(recipeId);
}


// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el modal
    recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));

    // Cargar página de inicio
    loadHomePage();
    
    // Event listeners para la navegación
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadHomePage();
    });
    
    // Event listener para el formulario de búsqueda
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchRecipes(searchTerm);
        }
    });
});

// Funciones de utilidad
function showLoading() {
    loadingIndicator.style.display = 'block';
    recipesContainer.innerHTML = '';
    errorMessage.classList.add('d-none');
}

function showDetailsLoading() {
  loadingIndicator.style.display = 'block';
  errorMessage.classList.add('d-none');
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message || 'An error occurred. Please try again.';
    errorMessage.classList.remove('d-none');
}

// Función para hacer peticiones a la API
async function fetchFromAPI(endpoint) {
    try {
        url = `${API_BASE_URL}${endpoint}`
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        showError(error.message);
        hideLoading();
        throw error;
    }
}

// Función para cargar la página de inicio
async function loadHomePage() {
    showLoading();
    
    try {
        // Cargar todas las categorías
        const categoriesData = await fetchFromAPI('/categories.php');
        const categories = categoriesData.categories;
        
        // Mostrar todas las categorías en el contenedor principal
        recipesContainer.innerHTML = `
            <div class="row g-4">                        
            <h2 class="text-center">List of categories</h2>
                ${categories.map(category => `
                    <div class="col-12 col-md-6 col-lg-4 mb-4">
                        <div class="card category-card" data-category="${category.strCategory}">
                            <div class="row g-0">
                                <div class="col-4">
                                    <img src="${category.strCategoryThumb}" class="img-fluid rounded-start p-2" alt="${category.strCategory}">
                                </div>
                                <div class="col-8">
                                    <div class="card-body">
                                        <h5 class="card-title">${category.strCategory}</h5>
                                        <p class="card-text small">${category.strCategoryDescription.substring(0, 100)}...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Agregar event listeners para las tarjetas de categorías
        document.querySelectorAll('.category-card').forEach(card => {
          card.addEventListener('click', () => {
              const category = card.getAttribute('data-category');
              searchRecipesByCategory(category);
          });
      });
        
    } catch (error) {
        console.error('Error loading home page:', error);
    } finally {
        hideLoading();
    }
}

// Función para buscar recetas
async function searchRecipes(searchTerm) {
  showLoading();
  
  try {
      const data = await fetchFromAPI(`/search.php?s=${encodeURIComponent(searchTerm)}`);
      
      if (data.meals) {
          recipesContainer.innerHTML = `
              <h2>Results for: "${searchTerm}"</h2>
              <div class="row g-4">
                  ${data.meals.map(meal => createRecipeCard(meal)).join('')}
              </div>
          `;
          
          addRecipeCardListeners();
      } else {
          recipesContainer.innerHTML = `
              <div class="col-12 text-center">
                  <h2 class="col-12 mb-4">No results found for: "${searchTerm}"</h2>
                  <p>Try using a different search term.</p>
              </div>
          `;
      }
  } catch (error) {
      console.error('Error searching recipes:', error);
  } finally {
      hideLoading();
  }
}

// Función para buscar recetas por categoría
async function searchRecipesByCategory(category) {
  showLoading();
  
  try {
      const data = await fetchFromAPI(`/filter.php?c=${encodeURIComponent(category)}`);
      
      if (data.meals) {
          recipesContainer.innerHTML = `
          <br>
              <h2 class="text-center">Recipes from the category: ${category}</h2>
              <div class="row g-4">
                  ${data.meals.map(meal => createRecipeCard(meal)).join('')}
              </div>
          `;
          
          addRecipeCardListeners();
      } else {
          recipesContainer.innerHTML = `
              <div class="text-center">
                  <h2>No recipes found in the category: ${category}</h2>
              </div>
          `;
      }
  } catch (error) {
      console.error('Error fetching recipes by category:', error);
  } finally {
      hideLoading();
  }
}

async function showRecipeDetails(recipeId) {
  // showLoading();
  showDetailsLoading();
  
  try {
      const data = await fetchFromAPI(`/lookup.php?i=${recipeId}`);
      
      if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];
          
          // Crear lista de ingredientes
          const ingredients = [];
          for (let i = 1; i <= 20; i++) {
              const ingredient = meal[`strIngredient${i}`];
              const measure = meal[`strMeasure${i}`];
              
              if (ingredient && ingredient.trim() !== '') {
                  ingredients.push(`${measure} ${ingredient}`);
              }
          }
          
          // Formatear las instrucciones
          const instructions = meal.strInstructions
              .split('\r\n')
              .filter(step => step.trim() !== '')
              .map((step, index) => `<p>${step}</p>`)
              .join('');
          
          // Actualizar el contenido del modal
          modalBody.innerHTML = `
          <div class="row">
              <div class="col-md-6 mb-4">
                  <div class="card">
                      <img src="${meal.strMealThumb}" class="card-img-top rounded recipe-detail-img" alt="${meal.strMeal}">
                      <div class="card-body">
                          <h5 class="card-title">${meal.strMeal}</h5>
                          <div class="mt-3">
                              <span class="badge bg-primary me-2">${meal.strCategory}</span>
                              ${meal.strArea ? `<span class="badge bg-secondary me-2">${meal.strArea}</span>` : ''}
                          </div>
                      </div>
                  </div>
              </div>
              <div class="col-md-6">
                  <h4 class="mb-3">Ingredients</h4>
                  <ul class="list-unstyled">
                      ${ingredients.map(ingredient => `
                          <li class="d-flex align-items-center mb-2">
                              <i class="fas fa-circle me-2 text-primary" style="font-size: 10px;"></i>
                              ${ingredient}
                          </li>
                      `).join('')}
                  </ul>
              </div>
          </div>
          <div class="row mt-4">
              <div class="col-12">
                  <h4>Instructions</h4>
                  <div class="mt-2">
                      <p>${instructions}</p>
                  </div>
              </div>
          </div>
      `;
      
          // Mostrar el modal
          recipeModal.show();
      } else {
          showError('Recipe not found');
      }
  } catch (error) {
      console.error('Error showing recipe details:', error);
  } finally {
      hideLoading();
  }
}

// Función para crear una tarjeta de receta
function createRecipeCard(meal) {
  return `
      <div class="col-12 col-md-6 col-lg-3 mb-4">
          <div class="card recipe-card h-100 position-relative overflow-hidden" 
              data-id="${meal.idMeal}" 
              onclick="viewRecipe('${meal.idMeal}')"
              style="cursor: pointer; transition: transform 0.3s, box-shadow 0.3s;"
              onmouseover="this.style.transform='scale(1.03)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)';" 
              onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='';">
              <div class="position-relative h-100">
                  <img src="${meal.strMealThumb}" class="card-img-top h-100 object-fit-cover" alt="${meal.strMeal}">
                  <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                      <h5 class="card-title text-center text-white m-0 p-2 px-3" style="background-color: rgba(0, 0, 0, 0.6); border-radius: 5px;">${meal.strMeal}</h5>
                  </div>
              </div>
              <div class="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-center">
                  ${meal.strCategory ? `
                      <span class="badge bg-primary">${meal.strCategory}</span>
                  ` : ''}
                  ${meal.strArea ? `
                      <span class="badge bg-secondary ms-1">${meal.strArea}</span>
                  ` : ''}
              </div>
          </div>
      </div>
  `;
}

// Función para añadir event listeners a las tarjetas de recetas
function addRecipeCardListeners() {
    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', () => {
            const recipeId = card.getAttribute('data-id');
            showRecipeDetails(recipeId);
        });
    });
}