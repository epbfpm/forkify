import icons from 'url:../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _parentEl = this.select('.pagination');
  currentPage = 0;

  addPaginationHandler(handler) {
    this._parentEl.addEventListener('click', e => {
      e.preventDefault();
      const target = e.target;

      target.closest('button')?.classList.contains('pagination__btn--prev') &&
        --this.currentPage;
      target.closest('button')?.classList.contains('pagination__btn--next') &&
        ++this.currentPage;
      handler(this.currentPage);
      return;
    });
  }

  _generateMarkup() {
    return `
  <button class="btn--inline pagination__btn--prev ${
    this._data === 1 ? 'hidden' : ''
  }">
    <svg class="search__icon ">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${this._data - 1}</span>
  </button>
  <button class="btn--inline pagination__btn--next ${
    this._data * 10 >= this.args ? 'hidden' : ''
  }">
    <span>Page ${this._data + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
  }
}

export default new PaginationView();
