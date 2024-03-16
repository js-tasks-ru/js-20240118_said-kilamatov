export default class NotificationMessage {
  static notificationMessage = null;
  element;

  constructor(text, { duration = 1000, type = "error" } = {}) {
    this.text = text;
    this.duration = duration;
    this.type = type;
    this.element = this.createElement(this.createTemplate());
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  show(container = document.body) {
    if (NotificationMessage.notificationMessage) {
      NotificationMessage.notificationMessage.destroy();
    }

    container.append(this.element);

    NotificationMessage.notificationMessage = this;

    this.timeoutId = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  createTemplate() {
    return `
    <div class="notification ${this.type}" style="--value:20s">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.text}
        </div>
      </div>
    </div>
    `;
  }

  remove() {
    this.element.remove();
    NotificationMessage.notificationMessage = null;
  }

  destroy() {
    this.remove();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
