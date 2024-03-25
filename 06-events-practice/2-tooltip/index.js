const range = 15;

class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;

    this.isShow = false;
  }

  createListeners() {
    document.body.addEventListener(
      "pointerover",
      this.handleDocumentPointerover
    );
    document.body.addEventListener("pointerout", this.hidePointerout);
    document.body.addEventListener("pointermove", this.showPositionPointermove);
  }

  destroyListeners() {
    document.body.removeEventListener(
      "pointerover",
      this.handleDocumentPointerover
    );
    document.body.removeEventListener("pointerout", this.hidePointerout);
    document.body.removeEventListener(
      "pointermove",
      this.showPositionPointermove
    );
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  handleDocumentPointerover = (event) => {
    const currentElement = event.target;
    const tooltip = currentElement.dataset.tooltip;

    if (!tooltip) {
      return;
    }

    this.render(tooltip);

    this.updateTooltipPosition(event.clientX, event.clientY);

    this.isShow = true;
  };

  hidePointerout = () => {
    if (this.isShow) {
      this.remove();
      this.isShow = false;
    }
  };

  showPositionPointermove = (event) => {
    if (this.isShow) {
      this.updateTooltipPosition(event.pageX, event.pageY);
    }
  };

  updateTooltipPosition(x, y) {
    this.element.style.left = x + range + "px";
    this.element.style.top = y + range + "px";
  }

  initialize() {
    this.destroyListeners();
    this.createListeners();
  }

  template(tooltip) {
    return `<div class="tooltip">${tooltip}</div>`;
  }

  render(tooltip) {
    this.element = this.createElement(this.template(tooltip));
    document.body.append(this.element);
  }

  remove() {
    this.element?.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}

export default Tooltip;
