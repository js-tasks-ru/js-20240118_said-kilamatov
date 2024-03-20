class Tooltip {
  static instance = null;

  tooltipElement = null;
  tooltipShow = null;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  initialize() {
    document.addEventListener("pointerover", this.showTooltip);
    document.addEventListener("pointerout", this.hideTooltip);
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  render(event) {
    this.tooltipElement = this.createElement(
      `<div class="tooltip">${event.target.dataset.tooltip}</div>`
    );
    return this.tooltipElement;
  }

  showTooltip = (event) => {
    const anchorElem = event.target.closest("[data-tooltip]");

    if (!anchorElem) return;

    anchorElem.ondragstart = function () {
      return false;
    };

    this.hideTooltip(); // Hide any existing tooltip before showing a new one

    this.tooltipShow = this.render(event);

    document.body.appendChild(this.tooltipShow); // Append to body instead of event target

    document.addEventListener("pointermove", this.positionTooltip);
  };

  positionTooltip = (event) => {
    if (!this.tooltipShow) return;

    const tooltipWidth = this.tooltipShow.offsetWidth;
    const tooltipHeight = this.tooltipShow.offsetHeight;

    let left = event.clientX + 10;
    let top = event.clientY + 10;

    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth;
    }
    if (left < 0) {
      left = 0;
    }

    if (top + tooltipHeight > window.innerHeight) {
      top = window.innerHeight - tooltipHeight;
    }
    if (top < 0) {
      top = 0;
    }

    this.tooltipShow.style.left = left + "px";
    this.tooltipShow.style.top = top + "px";
  };

  hideTooltip = () => {
    if (this.tooltipShow) {
      this.tooltipShow.remove();
      this.tooltipShow = null;
      document.removeEventListener("pointermove", this.positionTooltip);
    }
  };

  destroy() {
    if (this.tooltipShow) {
      this.tooltipShow.remove();
      this.tooltipShow = null;
      document.removeEventListener("pointermove", this.positionTooltip);
    }
    document.removeEventListener("pointerover", this.showTooltip);
    document.removeEventListener("pointerout", this.hideTooltip);
  }
}

export default Tooltip;
