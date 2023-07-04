import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

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
        return previewView.render(recipe);
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
}

export default new ResultsView();
