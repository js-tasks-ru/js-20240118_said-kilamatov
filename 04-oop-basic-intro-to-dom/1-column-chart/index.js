export default class ColumnChart {
  element;
  chartHeight = 50;
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
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;

    return this.data.map((item) => {
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
      : "column-chart column-chart_loading";
  }

  createPropchart() {
    return this.getColumnProps(this.data)
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
    this.data = newData;
    this.element.querySelector('[data-element="body"]').innerHTML =
      this.createPropchart();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
