import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {
  constructor(headerConfig, { data = [], sorted = {} } = {}) {
    super(headerConfig, data);
    super.sort(sorted.id, sorted.order);
    this.addEventSort();
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.createTemplateContainer();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  addEventSort() {
    const header = this.element.querySelector('[data-element="header"]');
    if (header) header.addEventListener("pointerdown", this.sort);
  }

  sort = (event) => {
    let colClicked = event.target.closest('[data-sortable="true"]');
    if (!colClicked) return;

    const hasArrow = colClicked.querySelector(".sortable-table__sort-arrow");
    if (hasArrow) hasArrow.remove();

    this.createTemplateArrow(colClicked);

    const order = this.createSortingOrder(colClicked);

    super.sort(colClicked.dataset.id, order);
  };

  createTemplateArrow(colClicked) {
    const element = document.createElement("div");
    element.innerHTML = `
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>
  `;
    colClicked.append(element.firstElementChild);
  }

  createSortingOrder(column) {
    const currOrder = column.dataset.order;
    const toggleOrder = {
      desc: "asc",
      asc: "desc",
    };

    return currOrder === "" ? "desc" : toggleOrder[currOrder];
  }
}
