import icons from 'url:../../img/icons.svg';
import View from './view.js';

class ResultsView extends View {
  _parentEl = this.select('.results');
  _start = 0;
  _end = 10;

  renderNewPage(currentPage) {
    this._start = currentPage * 10 - 10;
    this._end = currentPage * 10;
  }

  _generateMarkup() {
    if (this._data.length === 0) {
      return this._generateNoResultsMarkup();
    }

    const markup = this._data
      .map(recipe => {
        return this._generateResultsMarkup(recipe);
      })
      .slice(this._start, this._end)
      .join('');
    return markup;
  }

  _generateNoResultsMarkup() {
    return `<div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>No recipes found for your query. Please try again!</p>
        </div>`;
  }

  _generateResultsMarkup(recipe) {
    return `<li class="preview">
            <a class="preview__link" href="#/${recipe.id}"  >
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
                <div class="preview__user-generated">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>`;
  }
}

export default new ResultsView();
