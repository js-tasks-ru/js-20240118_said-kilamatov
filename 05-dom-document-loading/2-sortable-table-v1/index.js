export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
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
        }" data-order="">
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
        return headerItem.id === "images"
          ? headerItem.template()
          : `<div class="sortable-table__cell">${item[headerItem.id]}</div>`;
      })
      .join("");
  }

  sortNumberField = (field, order) => (a, b) => {
    return order === "asc" ? a[field] - b[field] : b[field] - a[field];
  };

  sortStringField = (field, order) => (a, b) => {
    return order === "asc"
      ? a[field].localeCompare(b[field], ["ru", "en"], {
          caseFirst: "upper",
        })
      : b[field].localeCompare(a[field], ["ru", "en"], {
          caseFirst: "upper",
        });
  };

  sort(field, order) {
    const sortableHeader = this.element.querySelector(`[data-id="${field}"]`);
    if (!sortableHeader || sortableHeader.dataset.sortable !== "true") return;
    sortableHeader.dataset.order = order;

    const sortType = this.headerConfig.find(
      (item) => item.id === field
    )?.sortType;

    const sortFn =
      sortType === "number"
        ? this.sortNumberField(field, order)
        : this.sortStringField(field, order);
    this.data.sort(sortFn);

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
    const result = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElements of elements) {
      const name = subElements.dataset.element;
      result[name] = subElements;
    }

    return result;
  }
}
