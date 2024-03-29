export default class ColumnChart {
  element;
  chartHeight = 50;
  subElements = {};

  constructor({
    label = "",
    link = "",
    value = 0,
    data = [],
    formatHeading = (arg) => arg,
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.element = this.createElement(this.createBodyChart());
    this.selectSubElements();
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map((item) => {
      return {
        percent: ((item / maxValue) * 100).toFixed(0) + "%",
        value: String(Math.floor(item * scale)),
      };
    });
  }

  createLinkElem() {
    return this.link
      ? `<a href="${this.link}" class="column-chart__link">View all</a>`
      : "";
  }

  createChartClasses() {
    return this.data.length
      ? "column-chart"
      : "column-chart_loading column-chart";
  }

  createPropchart(data = this.data) {
    const columnProps = this.getColumnProps(data);
    return columnProps
      .map(
        ({ value, percent }) =>
          `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
      )
      .join("");
  }

  createBodyChart() {
    return ` <div class="${this.createChartClasses()}" style="--chart-height: 50">
    <div class="column-chart__title">
      ${this.label}
      ${this.createLinkElem()}
    </div>
    <div class="column-chart__container">
      <div data-element="header" class="column-chart__header">${this.formatHeading(
        this.value
      )}</div>
      <div data-element="body" class="column-chart__chart">
      ${this.createPropchart()}
      </div>
    </div>
  </div>`;
  }

  update(newData) {
    if (!Array.isArray(newData)) return;

    const newValue = newData.reduce((acc, item) => acc + item);
    this.subElements.body.innerHTML = this.createPropchart(newData);
    this.subElements.header.innerHTML = this.formatHeading(newValue);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }
}
