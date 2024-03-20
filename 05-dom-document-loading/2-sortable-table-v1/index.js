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
        return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${
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
    const sortableHeader = this.element.querySelector(`[data-id="${field}"]`);
    if (!sortableHeader || sortableHeader.dataset.sortable !== "true") return;

    sortableHeader.dataset.order = order;

    const sortType = this.headerConfig.find(
      (item) => item.id === field
    )?.sortType;

    this.data.sort((a, b) => {
      if (sortType === "number") {
        return order === "asc" ? a[field] - b[field] : b[field] - a[field];
      }

      return order === "asc"
        ? a[field].localeCompare(b[field], ["ru-RU", "en-EN"], {
            caseFirst: "upper",
          })
        : b[field].localeCompare(a[field], ["ru-RU", "en-EN"], {
            caseFirst: "upper",
          });
    });

    const bodyContainer = this.element.querySelector("[data-element='body']");
    bodyContainer.innerHTML = this.createTemplateRows(this.data);

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
}
