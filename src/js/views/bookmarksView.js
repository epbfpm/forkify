import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmaksView extends View {
  _parentEl = this.select('.bookmarks__list');

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateNoBookmarkMarkup() {
    return `<div class="message">
                    <div>
                      <svg>
                        <use href="${icons}#icon-smile"></use>
                      </svg>
                    </div>
                    <p>
                      No bookmarks yet. Find a nice recipe and bookmark it :)
                    </p>
                  </div>
                  `;
  }

  _generateMarkup() {
    if (this._data.size === 0) return this._generateNoBookmarkMarkup();
    return [...this._data.values()]
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmaksView();
