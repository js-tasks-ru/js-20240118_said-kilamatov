import escapeHtml from "./utils/escape-html.js";
import fetchJson from "./utils/fetch-json.js";

const IMGUR_CLIENT_ID = "28aaa2e823b03b1";
const BACKEND_URL = "https://course-js.javascript.ru";

export default class ProductForm {
  // Статический метод sanitizeData для очистки данных от потенциально опасных HTML-тегов
  static sanitizeData = (data = {}) => {
    const entries = Object.entries(data); // Получение массива пар ключ-значение из объекта data
    const sanitizeValues = ([key, value]) => [key, (value = escapeHtml(value))]; // Функция для очистки значения от HTML-тегов

    return Object.fromEntries(entries.map(sanitizeValues)); // Возвращение очищенных данных в виде объекта
  };

  // Свойство data с начальными значениями полей формы товара
  data = {
    title: "",
    description: "",
    quantity: 1,
    subcategory: "",
    status: 1,
    price: 100,
    discount: 0,
    images: [],
  };
  subElements = {}; // Пустой объект для хранения подэлементов формы
  categories = []; // Пустой массив для хранения категорий товаров

  // Конструктор класса, принимает productId
  constructor(productId) {
    this.productId = productId; // Присвоение productId экземпляру класса
    this.element = this.createElement("element"); // Создание элемента формы

    this.selectSubElements(); // Выбор и сохранение подэлементов формы
    this.createListeners(); // Создание обработчиков событий
  }

  // Метод для выбора подэлементов формы и сохранения их в объекте subElements
  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }

  // Геттер для проверки наличия productId
  get hasProductId() {
    return this.productId !== undefined;
  }

  // Метод для создания элемента из HTML-строки
  createElementFromHTML = (htmlString) => {
    const tempDiv = document.createElement("div"); // Создание временного div-элемента
    tempDiv.innerHTML = htmlString.trim(); // Вставка HTML-строки во временный div

    return tempDiv.firstElementChild; // Возврат первого дочернего элемента временного div
  };

  // Геттер #templates для получения шаблонов разметки формы и её элементов
  get #templates() {
    const { createTemplate } = this; // Деструктуризация метода createTemplate из текущего экземпляра класса
    const { sanitizeData } = ProductForm; // Деструктуризация статического метода sanitizeData класса ProductForm

    // Шаблон для элемента формы товара
    const _elementTemplate = ({
      title,
      description,
      quantity,
      status,
      price,
      discount,
    }) => {
      return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input id="title" value="${title}" required="" type="text" name="title" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea id="description" value="${description}" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
              <ul class="sortable-list">
                ${createTemplate("images")}
              </ul>
            </div>
            <button id="uploadImage" type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select class="form-control" id="subcategory" name="subcategory">
              ${createTemplate("subcategory")}
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input id="price" value="${price}" required="" type="number" name="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input id="discount" value="${discount}" required="" type="number" name="discount" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input id="quantity" value="${quantity}" required="" type="number" class="form-control" name="quantity" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select id="status" value="${status}" class="form-control" name="status">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `;
    };

    // Шаблон для отдельного изображения товара
    const _imageTemplate = ({ source, url }) => {
      return `
      <li class="products-edit__imagelist-item sortable-list__item">
        <input type="hidden" name="url" value="${url}">
        <input type="hidden" name="source" value="${source}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${url}">
          <span>${source}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>
    `;
    };

    // Шаблон для подкатегории товара в выпадающем списке
    const _subcategoryTemplate = ({ categoryTitle, id, title }) => {
      return `
        <option value="${id}">${categoryTitle} > ${title}</option>
      `;
    };

    // Возврат объекта с шаблонами
    return {
      element: (data = this.data) => {
        const props = sanitizeData(data); // Очистка данных от HTML-тегов

        return _elementTemplate(props); // Возврат разметки элемента формы с очищенными данными
      },
      images: (data = this.data.images) => {
        return data.map((image) => createTemplate("image", image)).join(""); // Генерация разметки изображений товара
      },
      image: (data = "") => {
        const props = sanitizeData(data); // Очистка данных от HTML-тегов

        return _imageTemplate(props); // Возврат разметки изображения с очищенными данными
      },
      subcategory: (categories = this.categories) => {
        const createSubcategory = (categoryTitle, subcategory) => {
          const props = sanitizeData({ categoryTitle, ...subcategory }); // Очистка данных от HTML-тегов

          return _subcategoryTemplate(props); // Возврат разметки подкатегории с очищенными данными
        };

        const createCategory = ({ title: categoryTitle, subcategories }) => {
          return subcategories
            .map((subcategory) => createSubcategory(categoryTitle, subcategory))
            .join(""); // Генерация разметки категорий и их подкатегорий
        };

        return categories.map(createCategory).join(""); // Возврат разметки всех категорий и подкатегорий
      },
    };
  }

  // Асинхронный метод render для отображения формы товара
  async render() {
    const { fetchData, hasProductId } = this; // Деструктуризация метода fetchData и свойства hasProductId из текущего экземпляра класса

    // Асинхронные запросы данных о категориях и о товаре (если имеется productId)
    const categoriesPromise = fetchData("categories");
    const productPromise = hasProductId
      ? fetchData("products")
      : Promise.resolve([]);

    // Ожидание завершения обоих запросов
    const [categories, [product]] = await Promise.all([
      categoriesPromise,
      productPromise,
    ]);

    // Обновление данных формы и списка категорий
    this.data = product ?? this.data; // Если товар не получен, используются начальные данные
    this.categories = categories;

    this.updateForm(); // Обновление формы на основе полученных данных

    return this.element; // Возврат элемента формы
  }

  // Метод updateForm для обновления формы на основе текущих данных
  updateForm = () => {
    const { createTemplate, updateInputFields, data } = this; // Деструктуризация методов и свойств из текущего экземпляра класса
    const { productForm, imageListContainer } = this.subElements; // Деструктуризация подэлементов формы

    const imageList = imageListContainer.querySelector(".sortable-list"); // Получение списка изображений из контейнера
    const subcategory = productForm.querySelector("#subcategory"); // Получение списка подкатегорий из формы

    // Обновление разметки списка изображений и списка подкатегорий
    imageList.innerHTML = createTemplate("images", data.images); // Генерация разметки изображений и их добавление в список
    subcategory.innerHTML = createTemplate("subcategory"); // Генерация разметки подкатегорий и их добавление в список

    updateInputFields(); // Обновление значений полей ввода
  };

  // Метод updateInputFields для обновления значений полей ввода формы
  updateInputFields = () => {
    const { productForm } = this.subElements; // Деструктуризация подэлемента формы
    const formElements = [...productForm.elements]; // Преобразование HTML-коллекции элементов формы в массив

    // Функция для обновления значения поля ввода
    const updateField = (element) => {
      const value = this.data[element.name]; // Получение значения из данных формы по имени поля

      if (value !== undefined) {
        element.value = value; // Установка значения поля ввода
      }
    };

    formElements.forEach(updateField); // Обновление значений всех полей формы
  };

  // Метод createTemplate для создания разметки по имени шаблона и данным
  createTemplate = (templateName, data) => {
    const template = this.#templates[templateName]; // Получение соответствующего шаблона

    return (template && template(data)) ?? ""; // Вызов шаблона с данными и возврат результата
  };

  // Обработчик события mousedown для изображений товара
  handleImageMousedown = (e) => {
    const { deleteHandle, grabHandle } = e.target?.dataset; // Доступ к атрибутам data-delete-handle и data-grab-handle у элемента, вызвавшего событие

    const isDeleteAction = deleteHandle === ""; // Проверка наличия атрибута data-delete-handle
    const isDragAction = grabHandle === ""; // Проверка наличия атрибута data-grab-handle

    if (isDeleteAction) {
      this.deleteImage(e.target); // Удаление изображения при клике на иконку удаления
    } else if (isDragAction) {
      this.dragImage(e); // Перетаскивание изображения при клике на иконку перетаскивания
    }
  };

  // Асинхронный метод save для сохранения данных формы
  save = async (body) => {
    const url = new URL("/api/rest/products", BACKEND_URL); // Формирование URL для отправки данных
    const method = this.hasProductId ? "PATCH" : "POST"; // Определение HTTP-метода в зависимости от наличия productId

    const response = await fetchJson(url, {
      // Отправка запроса на сервер
      method, // Установка HTTP-метода
      body, // Передача данных
    });

    // Генерация и отправка события о сохранении товара
    this.dispatchEvent(this.hasProductId ? "product-updated" : "product-saved");

    return response; // Возврат ответа от сервера
  };

  // Обработчик события submit для формы товара
  handleFormSubmit = async (e) => {
    e.preventDefault(); // Предотвращение стандартного поведения формы

    const { productForm } = this.subElements; // Доступ к элементу формы
    const formData = new FormData(productForm); // Создание объекта FormData из данных формы

    await this.save(formData); // Сохранение данных формы на сервере
  };

  // Обработчик события click для кнопки загрузки изображения товара
  handleProductImageUpload = (e) => {
    let fileInput = getImageFileInput(); // Получение элемента input для загрузки изображения

    fileInput.click(); // Имитация клика по элементу input

    if (!fileInput.isConnected) {
      // Проверка, подключен ли элемент input к DOM
      document.body.appendChild(fileInput); // Добавление элемента input к DOM

      fileInput.onchange = async () => {
        // Обработчик события изменения содержимого элемента input
        const { productForm, imageListContainer } = this.subElements; // Доступ к элементам формы и контейнера изображений
        const uploadImageButton = productForm.querySelector("#uploadImage"); // Получение кнопки загрузки изображения
        const file = fileInput.files[0]; // Получение выбранного файла

        if (file !== undefined) {
          // Проверка наличия выбранного файла
          const body = new FormData(); // Создание объекта FormData для передачи данных на сервер
          body.append("image", file, file.name); // Добавление изображения к данным

          uploadImageButton.classList.add("is-loading"); // Добавление класса для отображения состояния загрузки

          const response = await this.uploadImage(body); // Отправка изображения на сервер

          uploadImageButton.classList.remove("is-loading"); // Удаление класса для отображения состояния загрузки

          const imageElement = this.createElement("image", {
            // Создание элемента изображения товара
            source: file.name,
            url: response.data.link,
          });

          imageListContainer.firstElementChild.appendChild(imageElement); // Добавление элемента изображения в список
        }

        fileInput.onchange = null; // Отмена обработчика события изменения содержимого элемента input

        document.body.removeChild(fileInput); // Удаление элемента input из DOM
      };
    }

    function getImageFileInput() {
      let fileInput = document.getElementById("uploadImageInput"); // Получение элемента input по ID

      if (!fileInput) {
        // Проверка, существует ли элемент input
        fileInput = document.createElement(`input`); // Создание элемента input
        fileInput.id = "uploadImageInput"; // Установка ID элемента input
        fileInput.name = "image"; // Установка имени элемента input
        fileInput.type = "file"; // Установка типа элемента input
        fileInput.accept = "image/*"; // Установка типов загружаемых файлов
        fileInput.style.display = "none"; // Скрытие элемента input
      }

      return fileInput; // Возврат элемента input
    }
  };

  // Асинхронный метод uploadImage для загрузки изображения на сервер
  uploadImage = async (body) => {
    const url = new URL("https://api.imgur.com/3/image"); // URL для загрузки изображения на Imgur
    const headers = new Headers({ Authorization: IMGUR_CLIENT_ID }); // Установка заголовка Authorization с ID клиента Imgur

    const response = await fetchJson(url, {
      // Отправка запроса на сервер Imgur
      method: "POST", // Использование метода POST
      headers, // Передача заголовков
      body, // Передача данных
    });

    return response; // Возврат ответа от сервера Imgur
  };

  // Метод deleteImage для удаления изображения товара
  deleteImage = (target) => {
    target.closest("li.products-edit__imagelist-item").remove(); // Удаление элемента изображения из списка
  };

  // Метод dragImage для перетаскивания изображения товара
  dragImage = (e) => {
    // Здесь должна быть логика для перетаскивания изображения, но она отсутствует в данном коде
  };

  // Метод createElement для создания элемента из HTML-разметки
  createElement(templateName, data) {
    const { createTemplate } = this; // Деструктуризация метода createTemplate из текущего экземпляра класса

    return this.createElementFromHTML(createTemplate(templateName, data)); // Создание элемента из HTML-разметки
  }

  // Метод createListeners для добавления обработчиков событий
  createListeners() {
    const { productForm, imageListContainer } = this.subElements; // Доступ к элементам формы и контейнера изображений
    const uploadImage = productForm.querySelector("#uploadImage"); // Получение кнопки загрузки изображения

    // Добавление обработчиков событий
    productForm.addEventListener("submit", this.handleFormSubmit); // Для события submit формы
    uploadImage.addEventListener("click", this.handleProductImageUpload); // Для клика по кнопке загрузки изображения
    imageListContainer.addEventListener(
      "pointerdown",
      this.handleImageMousedown // Для события mousedown на изображениях товара
    );
  }

  // Метод destroyListeners для удаления обработчиков событий
  destroyListeners() {
    const { productForm, imageListContainer } = this.subElements; // Доступ к элементам формы и контейнера изображений
    const uploadImage = productForm.querySelector("#uploadImage"); // Получение кнопки загрузки изображения

    // Удаление обработчиков событий
    productForm.removeEventListener("submit", this.handleFormSubmit); // Для события submit формы
    uploadImage.removeEventListener("click", this.handleProductImageUpload); // Для клика по кнопке загрузки изображения
    imageListContainer.removeEventListener(
      "pointerdown",
      this.handleImageMousedown // Для события mousedown на изображениях товара
    );
  }

  // Асинхронный метод fetchData для получения данных с сервера
  fetchData = async (endpoint) => {
    const url = this.createURL(endpoint); // Формирование URL для запроса

    const response = await fetchJson(url); // Отправка запроса на сервер и получение ответа

    return response; // Возврат ответа от сервера
  };

  // Метод createURL для создания URL для запроса данных с сервера
  createURL = (endpoint, params = {}) => {
    const url = new URL(`/api/rest/${endpoint}`, BACKEND_URL); // Формирование базового URL

    // Параметры запроса для разных эндпоинтов
    const queryParams = {
      products: {
        id: this.productId,
        ...params,
      },
      categories: {
        _sort: "weight",
        _refs: "subcategory",
        ...params,
      },
    };

    Object.entries(queryParams[endpoint]).forEach(
      (param) => url.searchParams.set(...param) // Добавление параметров запроса в URL
    );

    return url; // Возврат сформированного URL
  };

  // Метод dispatchEvent для генерации и отправки пользовательского события
  dispatchEvent = (eventName, detail = {}) => {
    const event = new CustomEvent(eventName, {
      // Создание пользовательского события
      bubbles: true, // Всплытие события
      detail, // Передача дополнительной информации
    });

    this.element.dispatchEvent(event); // Отправка события элементу формы
  };

  // Метод remove для удаления элемента формы из DOM
  remove() {
    this.element.remove(); // Удаление элемента формы из DOM
  }

  // Метод destroy для очистки ресурсов и удаления элемента формы
  destroy() {
    if (!this.element) return; // Проверка наличия элемента формы

    this.remove(); // Удаление элемента формы из DOM
    this.destroyListeners(); // Удаление обработчиков событий

    // Очистка свойств и значений
    this.element = null;
    this.subElements = null;
    this.productId = null;
    this.data = null;
    this.categories = null;
  }
}
