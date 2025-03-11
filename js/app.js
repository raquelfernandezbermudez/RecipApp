// API URL base
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Elementos del DOM
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const recipesContainer = document.getElementById('recipes-container');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const homeLink = document.getElementById('home-link');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
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

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
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
            // Mostrar un mensaje temporal de búsqueda (se implementará en commits posteriores)
            recipesContainer.innerHTML = `
                <div class="col-12 text-center my-5">
                    <h2>Searching for: "${searchTerm}"</h2>
                    <p class="mt-3">Recipe search results will be implemented in future updates.</p>
                    <div class="mt-4">
                        <i class="fas fa-search fa-3x text-primary"></i>
                    </div>
                </div>
            `;
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

// Función para buscar recetas por categoría (básica)
async function searchRecipesByCategory(category) {
    showLoading();
    
    try {
        const data = await fetchFromAPI(`/filter.php?c=${encodeURIComponent(category)}`);
        
        if (data.meals) {
            // Mostrar un mensaje temporal (se implementará en commits posteriores)
            recipesContainer.innerHTML = `
                <div class="col-12 text-center my-5">
                    <h2>Recipes from category: "${category}"</h2>
                    <p class="mt-3">Category results will be implemented in future updates.</p>
                    <div class="mt-4">
                        <i class="fas fa-list fa-3x text-primary"></i>
                    </div>
                </div>
            `;
        } else {
            recipesContainer.innerHTML = `
                <div class="text-center">
                    <h2>No se encontraron recetas en la categoría: ${category}</h2>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching recipes by category:', error);
    } finally {
        hideLoading();
    }
}