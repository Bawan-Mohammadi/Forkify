"use strict";

import View from "./view";
import resultsBookmarkView from "./resultsBookmarkView";
class AddRecipeView extends View {
  _parentElement = document.querySelector(".recipe-form");
  _message = "Recipe was successfully uploaded";
  _closeButton = document.querySelector(".close-button");
  _openButton = document.querySelector(".nav-button-one");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _addHandlerShowWindow() {
    const overlay = document.querySelector(".overlay");
    const modal = document.querySelector(".recipe-modal");

    this._openButton.addEventListener("click", function () {
      overlay.style.visibility = "visible";
      modal.style.visibility = "visible";
      document.body.classList.add("modal-open");
    });
  }

  _addHandlerHideWindow() {
    const overlay = document.querySelector(".overlay");
    const modal = document.querySelector(".recipe-modal");

    this._closeButton.addEventListener("click", function () {
      overlay.style.visibility = "hidden";
      modal.style.visibility = "hidden";
      document.body.classList.remove("modal-open");
    });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  _generateMarkup() {

  }
}

export default new AddRecipeView();
