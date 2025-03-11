(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function s(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(o){if(o.ep)return;o.ep=!0;const r=s(o);fetch(o.href,r)}})();const b="https://www.themealdb.com/api/json/v1/1",$=document.getElementById("search-form"),w=document.getElementById("search-input"),c=document.getElementById("recipes-container"),p=document.getElementById("loading"),d=document.getElementById("error-message"),L=document.getElementById("home-link"),E=document.getElementById("modalBody");document.getElementById("modalTitle");let g;document.addEventListener("DOMContentLoaded",()=>{g=new bootstrap.Modal(document.getElementById("recipeModal")),u(),L.addEventListener("click",e=>{e.preventDefault(),u()}),$.addEventListener("submit",e=>{e.preventDefault();const t=w.value.trim();t&&M(t)})});function m(){p.style.display="block",c.innerHTML="",d.classList.add("d-none")}function x(){p.style.display="block",d.classList.add("d-none")}function n(){p.style.display="none"}function h(e){d.textContent=e||"An error occurred. Please try again.",d.classList.remove("d-none")}async function l(e){try{const t=`${b}${e}`,s=await fetch(t);if(!s.ok)throw new Error(`Error HTTP: ${s.status}`);return await s.json()}catch(t){throw console.error("Error fetching data:",t),h(t.message),n(),t}}async function u(){m();try{const t=(await l("/categories.php")).categories;c.innerHTML=`
            <div class="row g-4">                        
            <h2 class="text-center">List of categories</h2>
                ${t.map(s=>`
                    <div class="col-12 col-md-6 col-lg-4 mb-4">
                        <div class="card category-card" data-category="${s.strCategory}">
                            <div class="row g-0">
                                <div class="col-4">
                                    <img src="${s.strCategoryThumb}" class="img-fluid rounded-start p-2" alt="${s.strCategory}">
                                </div>
                                <div class="col-8">
                                    <div class="card-body">
                                        <h5 class="card-title">${s.strCategory}</h5>
                                        <p class="card-text small">${s.strCategoryDescription.substring(0,100)}...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `,document.querySelectorAll(".category-card").forEach(s=>{s.addEventListener("click",()=>{const a=s.getAttribute("data-category");I(a)})})}catch(e){console.error("Error loading home page:",e)}finally{n()}}async function M(e){m();try{const t=await l(`/search.php?s=${encodeURIComponent(e)}`);t.meals?(c.innerHTML=`
              <h2>Results for: "${e}"</h2>
              <div class="row g-4">
                  ${t.meals.map(s=>f(s)).join("")}
              </div>
          `,y()):c.innerHTML=`
              <div class="col-12 text-center">
                  <h2 class="col-12 mb-4">No results found for: "${e}"</h2>
                  <p>Try using a different search term.</p>
              </div>
          `}catch(t){console.error("Error searching recipes:",t)}finally{n()}}async function I(e){m();try{const t=await l(`/filter.php?c=${encodeURIComponent(e)}`);t.meals?(c.innerHTML=`
          <br>
              <h2 class="text-center">Recipes from the category: ${e}</h2>
              <div class="row g-4">
                  ${t.meals.map(s=>f(s)).join("")}
              </div>
          `,y()):c.innerHTML=`
              <div class="text-center">
                  <h2>No recipes found in the category: ${e}</h2>
              </div>
          `}catch(t){console.error("Error fetching recipes by category:",t)}finally{n()}}async function C(e){x();try{const t=await l(`/lookup.php?i=${e}`);if(t.meals&&t.meals.length>0){const s=t.meals[0],a=[];for(let r=1;r<=20;r++){const i=s[`strIngredient${r}`],v=s[`strMeasure${r}`];i&&i.trim()!==""&&a.push(`${v} ${i}`)}const o=s.strInstructions.split(`\r
`).filter(r=>r.trim()!=="").map((r,i)=>`<p>${r}</p>`).join("");E.innerHTML=`
          <div class="row">
              <div class="col-md-6 mb-4">
                  <div class="card">
                      <img src="${s.strMealThumb}" class="card-img-top rounded recipe-detail-img" alt="${s.strMeal}">
                      <div class="card-body">
                          <h5 class="card-title">${s.strMeal}</h5>
                          <div class="mt-3">
                              <span class="badge bg-primary me-2">${s.strCategory}</span>
                              ${s.strArea?`<span class="badge bg-secondary me-2">${s.strArea}</span>`:""}
                          </div>
                      </div>
                  </div>
              </div>
              <div class="col-md-6">
                  <h4 class="mb-3">Ingredients</h4>
                  <ul class="list-unstyled">
                      ${a.map(r=>`
                          <li class="d-flex align-items-center mb-2">
                              <i class="fas fa-circle me-2 text-primary" style="font-size: 10px;"></i>
                              ${r}
                          </li>
                      `).join("")}
                  </ul>
              </div>
          </div>
          <div class="row mt-4">
              <div class="col-12">
                  <h4>Instructions</h4>
                  <div class="mt-2">
                      <p>${o}</p>
                  </div>
              </div>
          </div>
      `,g.show()}else h("Recipe not found")}catch(t){console.error("Error showing recipe details:",t)}finally{n()}}function f(e){return`
      <div class="col-12 col-md-6 col-lg-3 mb-4">
          <div class="card recipe-card h-100 position-relative overflow-hidden" 
              data-id="${e.idMeal}" 
              onclick="viewRecipe('${e.idMeal}')"
              style="cursor: pointer; transition: transform 0.3s, box-shadow 0.3s;"
              onmouseover="this.style.transform='scale(1.03)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)';" 
              onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='';">
              <div class="position-relative h-100">
                  <img src="${e.strMealThumb}" class="card-img-top h-100 object-fit-cover" alt="${e.strMeal}">
                  <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                      <h5 class="card-title text-center text-white m-0 p-2 px-3" style="background-color: rgba(0, 0, 0, 0.6); border-radius: 5px;">${e.strMeal}</h5>
                  </div>
              </div>
              <div class="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-center">
                  ${e.strCategory?`
                      <span class="badge bg-primary">${e.strCategory}</span>
                  `:""}
                  ${e.strArea?`
                      <span class="badge bg-secondary ms-1">${e.strArea}</span>
                  `:""}
              </div>
          </div>
      </div>
  `}function y(){document.querySelectorAll(".recipe-card").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-id");C(t)})})}
