export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = JSON.parse(JSON.stringify(data));

    this.render();
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.createTemplateContainer();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.removeDefaultSortingArrows();
  }

  createTemplateContainer() {
    return `<div data-element="productsContainer" class="products-list__container">
              <div class="sortable-table">
                <div data-element="header" class="sortable-table__header sortable-table__row">
                  ${this.createTemplateHeaderConfig()}
                </div>
                <div data-element="body" class="sortable-table__body">
                ${this.createTemplateRows()}
                </div>
                <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

                <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                  <div>
                    <p>No products satisfy your filter criteria</p>
                    <button type="button" class="button-primary-outline">Reset all filters</button>
                  </div>
                </div>
              </div>
            </div>`;
  }

  createTemplateHeaderConfig() {
    return this.headerConfig
      .map((item) => {
        const sortableClass = item.sortable ? "sortable-table__cell" : "";
        return `
        <div class="${sortableClass}" data-id="${item.id}" data-sortable="${
          item.sortable
        }">
          <span>${item.title}</span>
          ${
            item.id === "title"
              ? '<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>'
              : ""
          }
        </div>`;
      })
      .join("");
  }

  createTemplateRows(data = this.data) {
    return data
      .map(
        (item) => `<a href="/products/${item.id}" class="sortable-table__row">
    ${this.createTemplateRowCells(item)}
  </a>`
      )
      .join("");
  }

  createTemplateRowCells(item) {
    return this.headerConfig
      .map((headerItem) => {
        if (headerItem.id === "images") {
          return `
            <div class="sortable-table__cell">
              <img class="sortable-table-image" alt="Image" src="${
                item.images[0]?.url || "https://via.placeholder.com/32"
              }">
            </div>
          `;
        }

        return `<div class="sortable-table__cell">${item[headerItem.id]}</div>`;
      })
      .join("");
  }

  sort(field, order) {
    const sortType = this.headerConfig.find(
      (item) => item.id === field
    )?.sortType;

    this.data.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (sortType === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue, ["ru-RU", "en-EN"], {
              caseFirst: "upper",
            })
          : bValue.localeCompare(aValue, ["ru-RU", "en-EN"], {
              caseFirst: "upper",
            });
      }

      return order === "asc" ? aValue - bValue : bValue - aValue;
    });

    this.updateBody();
  }

  updateBody() {
    this.subElements.body.innerHTML = this.createTemplateRows();
  }

  remove() {
    this.element?.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  getSubElements(element) {
    const subElements = element.querySelectorAll("[data-element]");

    return [...subElements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;
      return acc;
    }, {});
  }

  removeDefaultSortingArrows() {
    const headerCells = this.element.querySelectorAll(
      '[data-element="header"] .sortable-table__cell'
    );
    headerCells.forEach((cell) => {
      const sortArrow = cell.querySelector(".sortable-table__sort-arrow");
      if (sortArrow) {
        sortArrow.remove();
      }
    });
  }
}
