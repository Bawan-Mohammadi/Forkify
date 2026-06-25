"use strict";
import View from "./view";
import icons from "url:../../icons.svg";
import resultsBookmarkView from "./resultsBookmarkView";
class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmark-modal");
  _errorMessage = "No bookmarks yet, find a nice recipe and bookmark it.";
  _message = "";
  _generateMarkup() {
    if (!this._data || this._data.length === 0) {
      return `
      <div class="bookmark-modal-text">
        <svg class="bookmark-modal-icon">
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
        <p>${this._errorMessage}</p>
      </div>
    `;
    }

    return (
      this._data
        .map((bookmark) => resultsBookmarkView.render(bookmark, false))
        //instead of rendering it directly into the dom we return he markup as a string
        .join("")
    );
    //     Take every search result
    // create one preview card for each result
    // join all preview cards into one big HTML string
    // insert that whole string into .results
  }
  render(data) {
    this._data = data;

    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
}

export default new BookmarksView();
