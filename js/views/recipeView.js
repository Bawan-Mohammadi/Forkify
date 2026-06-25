"use strict";
import View from "./view";
import icons from "url:../../icons.svg"; //url for images etc
import Fraction from "fraction.js";

class RecipeView extends View {
  _parentElement = document.querySelector(".box-body");
  _errorMessage = "We could not find that recipe. Please try another one.";
  _message = "";

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) =>
      window.addEventListener(ev, handler),
    );
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".servings-btn");
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      if (updateTo > 0) handler(updateTo);
    });
  }
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".body-food-bookmark-button");
      if (!btn) return;
      handler();
    });
  }
  _generateMarkup() {
    return `
        <div class="body-img-wrapper">
          <img class="body-img" src="${this._data.image}" alt="${this._data.title}" />
          <h1 class="body-food-title"><span>${this._data.title}</span></h1>
        </div>
        <div class="body-food-details-bookmark">
          <div class="body-food-details">
            <div class="food-details-flex">
              <svg class="all-icon">
                <use href="${icons}#icon-clock"></use>
              </svg>
              <p><span>${this._data.cookingTime}</span> minutes</p>
            </div>
            <div class="food-details-flex">
              <svg class="all-icon">
                <use href="${icons}#icon-users"></use>
              </svg>
              <p><span>${this._data.servings}</span> servings</p>
              <div>
                <button class="servings-btn" data-update-to="${this._data.servings - 1}">
                  <svg class="all-icon ">
                    <use href="${icons}#icon-minus-circle"></use>
                  </svg>
                  </button>
                  <button class="servings-btn" data-update-to="${this._data.servings + 1}">
                  <svg class="all-icon">
                    <use href="${icons}#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="body-user-bookmark">
            <div class="user-icon-body ${this._data.key ? "" : "hidden"} ">
              <svg class="all-icon">
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
            <div class="body-food-bookmark">
              <button class="body-food-bookmark-button flex-utility">
                <svg class="bookmark-icon-2 ${this._data.bookmarked ? "active-bookmark" : ""}" viewBox="0 0 24 24">
                  <path
                    d="M17 2h-10c-1.7 0-3 1.3-3 3v16c0 0.4 0.2 0.7 0.5 0.9s0.7 0.1 1-0.1l6.4-4.6 6.4 4.6c0.2 0.1 0.4 0.2 0.6 0.2s0.3 0 0.5-0.1c0.3-0.2 0.5-0.5 0.5-0.9v-16c0.1-1.7-1.2-3-2.9-3z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
     
          <div class="ingredients flex-utility">
          <p class="body-head-text">Recipe ingredients</p> 
            <div class="ingredients-space">
              ${
                this._data.ingredients?.map(this._generateMarkupIng).join("") ??
                "" //turn the array into a string
              }
               </div>
        </div>
        
         <div class="how-to flex-utility">
          <p class="body-head-text">How to cook it</p>

          <p class="how-to-text">
            This recipe was carefully designed and tested by
            <span class="creator-name-how-to">${this._data.publisher}</span>. Please
            check out directions at their website.
          </p>
    <a href="${this._data.sourceURL}" target="_blank" class="directions-button">
  DIRECTIONS
  <svg class="right-arrow">
    <use href="${icons}#icon-arrow-right"></use>
  </svg>
</a>
      </div>`;
  }

  _generateMarkupIng(ing) {
    return `   
      <div class="ingredients-detailed">
        <svg class="all-icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <p> 
          <span>${
            ing.quantity ? new Fraction(ing.quantity).toFraction(true) : ""
          }</span> 
          <span>${ing.unit}</span> ${ing.description}
        </p>
      </div>
    `;
  }
}

export default new RecipeView();
