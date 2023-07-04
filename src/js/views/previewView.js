import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  render(recipe) {
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

export default new PreviewView();
