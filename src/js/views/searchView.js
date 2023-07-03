import View from './view.js';

class SearchView extends View {
  _parentEl = this.select('.results');
  _searchField = this.select('.search__field');
  _searchBtn = this.select('.search__btn');
  _query;

  getQuery() {
    this._query = this._searchField.value;
    // return 'pizza'; // ⚠️ ONLY TO MAKE PIZZAS APPEAR REMOVE
    return this._query;
  }

  addSearchHandler(handler) {
    this._searchBtn.addEventListener('click', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
