"use strict";
import View from "./view";
import icons from "url:../../icons.svg";
import resultsBookmarkView from "./resultsBookmarkView";
class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recepies found for your query, please try again!";
  _message = "";
  _generateMarkup() {
    return (
      this._data
        .map((result) => resultsBookmarkView.render(result, false))
        //instead of rendering it directly into the dom we return the markup as a string
        .join("")
    );
  }
}

export default new ResultsView();
