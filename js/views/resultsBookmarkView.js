"use strict";
import View from "./view";
import icons from "url:../../icons.svg";
class ResultsBookmarkView extends View {
  _parentElement = "";
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return `<a class="side-food-wrapper ${this._data.id === id ? "active" : ""}" href="#${this._data.id}">
          <div class="side-img-wrapper">
            <img class="side-img" src="${this._data.image}" alt="picture" />
          </div>
          <div class="side-grid">
            <div class="side-food-name">
              <p>${this._data.title}</p>
            </div>
            <div class="side-food-creator">
              <p>${this._data.publisher}</p>
            </div>

            <div class="user-icon-side ${this._data.key ? "" : "hidden"} ">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
  
      </a>`;
  }
}
export default new ResultsBookmarkView();
