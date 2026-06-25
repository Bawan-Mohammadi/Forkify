"use strict";
import View from "./view";
import icons from "url:../../icons.svg";
class BookmarkModalView extends View {
  _parentElement = document.querySelector(".nav-button-two");
  constructor() {
    super();
    this._showModalHoverHandler();
  }
  _showModalHoverHandler() {
    const modal = document.querySelector(".bookmark-modal-wrapper");
    this._parentElement.addEventListener("mouseenter", function () {
      if (!modal) return;
      modal.style.visibility = "visible";
      modal.style.opacity = 1;
    });

    this._parentElement.addEventListener("mouseleave", function () {
      if (!modal) return;

      modal.style.visibility = "hidden";
      modal.style.opacity = 0;
    });
    modal.addEventListener("mouseenter", function () {
      if (!modal) return;

      modal.style.visibility = "visible";
      modal.style.opacity = 1;
    });
    modal.addEventListener("mouseleave", function () {
      if (!modal) return;
      modal.style.visibility = "hidden";
      modal.style.opacity = 0;
    });
  }
}
export default new BookmarkModalView();
