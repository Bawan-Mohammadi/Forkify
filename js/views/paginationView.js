"use strict";
import { RES_PER_PAGE } from "../config";
import View from "./view";
import icons from "url:../../icons.svg";
class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");
  addHandlerClick(handler) {
    //event delegation
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".page-button");
      if (!btn) return;

      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    //number of search results divided by 10
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );
    //page 1, there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
        
            <button data-goto='${curPage + 1}' class="page-button button-one flex-utility">
              <p>Page <span>${curPage + 1}</span></p>
              <svg>
                <use xlink:href="${icons}#icon-arrow-right"></use>
              </svg>
            </button>
     
          `
    }

    //last page
    if (curPage === numPages && numPages > 1) {
      return `       
            <button data-goto='${curPage - 1}' class="page-button button-two flex-utility">
              <svg>
                <use xlink:href="${icons}#icon-arrow-left"></use>
              </svg>
              <p>Page <span>${curPage - 1}</span></p>
            </button>
          `
    }
    //other page
    if (curPage > 1 && curPage < numPages) {
      return `  
            <button  data-goto='${curPage - 1}' class="page-button button-two flex-utility">
              <svg>
                <use xlink:href="${icons}#icon-arrow-left"></use>
              </svg>
              <p>Page <span>${curPage - 1}</span></p>
            </button>
          </div>
         
            <button data-goto='${curPage + 1}' class="page-button button-one flex-utility">
              <p>Page <span>${curPage + 1}</span></p>
              <svg>
                <use xlink:href="${icons}#icon-arrow-right"></use>
              </svg>
            </button>
      
        `
    }
    //page 1, no other pages
    return "";
  }
}

export default new PaginationView();
