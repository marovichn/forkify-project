import View from "./View";
import icons from "url:../../img/icons.svg";
import { RES_PER_PAGE } from "../config";

class PaginationView extends View{
    _parentEl = document.querySelector(".pagination");
    _plus = document.querySelector(".pagination__btn--next");
    _minus = document.querySelector(".pagination__btn--prev");


    addHandlerClick(handler){
        this._parentEl.addEventListener("click", function(e) {
        const btn = e.target.closest(".btn--inline");
        if(!btn)return;
        const goToPage = +btn.dataset.goto;
        handler(goToPage);
    })
    };

    _generateMarkup(){
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / RES_PER_PAGE);
        //page 1 and more
        if(curPage === 1 && this._data.results.length >= RES_PER_PAGE){return `<button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button>`;}
        //page 1 and no more
        else if(this._data.results.length < RES_PER_PAGE){
            return ` `;
        }
        //last page
        else if(numPages === curPage && numPages > 1){return `<button data-goto="${curPage - 1}"  class="btn--inline pagination__btn--prev"><svg class="search__icon"><use href="${icons}#icon-arrow-left"></use></svg><span>Page ${curPage -1}</span></button>`;}

        //middle page
        else{
            return `<button  data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev"><svg class="search__icon"><use href="${icons}#icon-arrow-left"></use></svg><span>Page ${curPage - 1}</span></button><button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button>`;
        }
    }
}
export default new PaginationView();