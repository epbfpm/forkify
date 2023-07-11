import View from './view.js';

class SearchView extends View {
  _parentEl = this.select('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this.#clearInput;
    return query;
  }

  #clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addSearchHandler(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
