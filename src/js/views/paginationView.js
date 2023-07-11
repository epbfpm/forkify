import icons from 'url:../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _parentEl = this.select('.pagination');
  delta = 0;

  addPaginationHandler(handler) {
    this._parentEl.addEventListener('click', e => {
      e.preventDefault();
      const target = e.target;
      this.delta = 0;

      target.closest('button')?.classList.contains('pagination__btn--prev') &&
        --this.delta;
      target.closest('button')?.classList.contains('pagination__btn--next') &&
        ++this.delta;

      handler(this.delta);
      return;
    });
  }

  _generateMarkup() {
    return `
  <button class="btn--inline pagination__btn--prev ${
    this._data.page === 1 ? 'hidden' : ''
  }">
    <svg class="search__icon ">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${this._data.page - 1}</span>
  </button>
  <button class="btn--inline pagination__btn--next ${
    this._data.page * 10 >= this._data.results.length ? 'hidden' : ''
  }">
    <span>Page ${this._data.page + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
  }
}

export default new PaginationView();
