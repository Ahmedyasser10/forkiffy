import View from './view';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    const curPage = this._data.page;
    if (curPage !== 1 && curPage !== numPages) {
      return `
      <button data-page = ${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      <button  data-page = ${
        curPage + 1
      }  class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    }
    if (curPage === 1 && numPages > 1) {
      return `
    <button data-page = ${
      curPage + 1
    } class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
      `;
    }
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-page = ${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      `;
    }
    return '';
  }
  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const el = e.target.closest('.btn--inline');
      if (!el) return;
      handler(+el.dataset.page);
    });
  }
}
export default new PaginationView();
