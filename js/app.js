// Elementos del DOM
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const recipesContainer = document.getElementById("recipes-container");
const homeLink = document.getElementById("home-link");

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Cargar página de inicio con mensaje de bienvenida
  loadWelcomeMessage();

  // Event listeners para la navegación
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    loadWelcomeMessage();
  });

  // Event listener para el formulario de búsqueda
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      // Simulación de búsqueda (se implementará en commits posteriores)
      showSearchMessage(searchTerm);
    }
  });
});

// Función para mostrar mensaje de bienvenida
function loadWelcomeMessage() {
  recipesContainer.innerHTML = `
    <div class="col-12 text-center my-5">
      <h2>Welcome to RecipApp!</h2>
      <p class="mt-3">Search for your favorite recipes or explore categories.</p>
      <div class="mt-4">
        <i class="fas fa-utensils fa-3x text-primary"></i>
      </div>
    </div>
  `;
}

// Función para mostrar mensaje de búsqueda
function showSearchMessage(searchTerm) {
  recipesContainer.innerHTML = `
    <div class="col-12 text-center my-5">
      <h2>Searching for: "${searchTerm}"</h2>
      <p class="mt-3">Recipe search functionality will be implemented in future updates.</p>
      <div class="mt-4">
        <i class="fas fa-search fa-3x text-primary"></i>
      </div>
    </div>
  `;
}
