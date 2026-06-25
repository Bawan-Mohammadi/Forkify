"use strict";

class SearchView {
  _parentElement = document.querySelector(".search-bar");

  getQuery() {
    const query = this._parentElement.querySelector(".search-input").value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector(".search-input").value = "";
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler(); // the function we pass in
    });
  }
}

export default new SearchView();
