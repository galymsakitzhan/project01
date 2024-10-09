import { carData } from "./data.js";

let selectedExteriorImages = [];
let selectedInteriorImages = [];
let selectedCar = {};
let formData = {};

// Форматирование цены
function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Инициализация страницы
document.addEventListener("DOMContentLoaded", () => {
  const modelSelectTrigger = document.getElementById("model-select-trigger");
  const modelOptionsContainer = document.getElementById(
    "model-options-container"
  );

  // Инициализация опций моделей
  function initModelOptions() {
    carData.models.forEach((model, index) => {
      const optionDiv = document.createElement("div");
      optionDiv.textContent = model.name;
      optionDiv.classList.add("model-option");
      optionDiv.dataset.index = index;

      // Обработка клика по опции модели
      optionDiv.addEventListener("click", (event) => {
        const selectedModelIndex = event.target.dataset.index;
        const selectedModel = carData.models[selectedModelIndex];
        displayConfigurations(selectedModel);

        // Закрытие выпадающего списка после выбора модели
        modelOptionsContainer.style.display = "none";
      });

      modelOptionsContainer.appendChild(optionDiv);
    });
  }

  // Автоматический выбор первой модели
  initModelOptions();
  const defaultModel = carData.models[0];
  displayConfigurations(defaultModel);

  // Открытие и закрытие выпадающего списка
  modelSelectTrigger.addEventListener("click", () => {
    const isVisible = modelOptionsContainer.style.display === "block";
    modelOptionsContainer.style.display = isVisible ? "none" : "block";
  });
});

// Отображение всех комплектаций выбранной модели
function displayConfigurations(model) {
  const equipmentContainer = document.querySelector(".option__car");
  equipmentContainer.innerHTML = "";

  model.configurations.forEach((config, index) => {
    const configDiv = document.createElement("div");
    configDiv.classList.add("main_conf", "equipment");

    const configName = document.createElement("div");
    configName.classList.add("equipment__name");
    configName.textContent = config.name;

    // Создание элемента цены
    const configPriceWithTradeIn = createPriceElement(config, true);

    configDiv.appendChild(configName);
    configDiv.appendChild(configPriceWithTradeIn);

    // Обработка клика по комплектации
    configDiv.addEventListener("click", () => {
      const previouslySelected = document.querySelector(".equipment.selected");
      if (previouslySelected) {
        previouslySelected.classList.remove("selected");
      }
      configDiv.classList.add("selected");

      renderCarData(model, config);
    });

    // Автоматический выбор первой комплектации
    if (index === 0) {
      configDiv.click();
    }

    equipmentContainer.appendChild(configDiv);
  });
}

// Функция для отображения данных выбранной конфигурации
  function renderCarData(model, selectedConfig) {
    // Отображение имени модели
    document.querySelector(".names").textContent = model.name;

    // Обновляем секции модификаций, экстерьера, колес и интерьера
    displayModifications(selectedConfig);
    displayExterior(selectedConfig); // Обновляем экстерьер
    displayWheels(selectedConfig); // Обновляем колеса
    displayInterior(selectedConfig); // Обновляем интерьер

    // Устанавливаем слайдер с изображениями первого экстерьера и интерьера
    selectedExteriorImages = selectedConfig.exterior[0].carImageUrl;
    selectedInteriorImages = selectedConfig.interior[0].interiorImageUrl;
    updateSlider(selectedExteriorImages.concat(selectedInteriorImages));

    // Рассчитываем итоговую цену
    const totalPrice = calculateTotalPrice(selectedConfig);
    document.querySelector(".total-price").textContent =
      formatPrice(totalPrice);

    // Обновляем пакет, если есть
    displayPacket(selectedConfig, model.name);

    // Добавляем проверку модели для отображения спецификаций
    const specElement = document.querySelector(".specifications");
    specElement.innerHTML = ""; // Очищаем содержимое перед добавлением нового

    if (model.name === "Zeekr 001") {
      // Если выбрана модель Zeekr 001, отображаем спецификацию для нее
      specElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" style="fill: orange;">
          <path d="M331-431h37v-83h48q15.725 0 26.362-10.638Q453-535.275 453-551v-48q0-15.725-10.638-26.362Q431.725-636 416-636h-85v205Zm37-120v-48h48v48h-48Zm129 120h84q15 0 26-10.638 11-10.637 11-26.362v-131q0-15.725-11-26.362Q596-636 581-636h-84v205Zm37-37v-131h47v131h-47Zm133 37h37v-83h50v-37h-50v-48h50v-37h-87v205ZM260-200q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h560q24 0 42 18t18 42v560q0 24-18 42t-42 18H260Zm0-60h560v-560H260v560ZM140-80q-24 0-42-18t-18-42v-620h60v620h620v60H140Zm120-740v560-560Z"></path>
        </svg>
        <p style="margin: 13px 0; font-size: 18px;">
          <a style="color: orange;" href="https://zeekr-configurator.kz/userdata/rubrics/rubrics_2/pdf_ru.pdf?1725615272" target="_blank">Спецификация</a>
        </p>`;
    } else if (model.name === "Zeekr X") {
      // Если выбрана модель Zeekr X, отображаем спецификацию для нее
      specElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" style="fill: orange;">
          <path d="M331-431h37v-83h48q15.725 0 26.362-10.638Q453-535.275 453-551v-48q0-15.725-10.638-26.362Q431.725-636 416-636h-85v205Zm37-120v-48h48v48h-48Zm129 120h84q15 0 26-10.638 11-10.637 11-26.362v-131q0-15.725-11-26.362Q596-636 581-636h-84v205Zm37-37v-131h47v131h-47Zm133 37h37v-83h50v-37h-50v-48h50v-37h-87v205ZM260-200q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h560q24 0 42 18t18 42v560q0 24-18 42t-42 18H260Zm0-60h560v-560H260v560ZM140-80q-24 0-42-18t-18-42v-620h60v620h620v60H140Zm120-740v560-560Z"></path>
        </svg>
        <p style="margin: 13px 0; font-size: 18px;">
          <a style="color: orange;" href="https://configurator.zeekralmaty.kz/userdata/rubrics/rubrics_7/pdf_ru.pdf?1725615303" target="_blank">Спецификация</a>
        </p>`;
    }
  }

// Создание элемента цены
function createPriceElement(config, withTradeIn = true) {
  const configPrice = document.createElement("div");
  configPrice.classList.add("equipment__price");

  if (withTradeIn) {
    configPrice.innerHTML = `<span class="tradein">от ${formatPrice(
      config.price
    )}</span><div class="trade1">с учетом Trade-In</div>`;
  } else {
    configPrice.innerHTML = `<span class="tradein">от ${formatPrice(
      config.price
    )}</span>`;
  }

  return configPrice;
}

// Отображение характеристик конфигурации
function displayModifications(config) {
  const modificationContainer = document.querySelector(".modification");
  modificationContainer.innerHTML = "";
  config.modification.forEach((mod) => {
    const col = document.createElement("div");
    col.classList.add("col");
    col.innerHTML = `
      <div class="title-sm">${mod.title}</div>  
      <div class="text-sm">${mod.text}</div>
    `;
    modificationContainer.appendChild(col);
  });
}

// Отображение экстерьера
function displayExterior(config) {
  const exteriorContainer = document.querySelector(".exterior .car__colors");
  const nameExterior = document.querySelector(".name__exterior");
  const priceExterior = document.querySelector(".price__exterior");

  exteriorContainer.innerHTML = ""; // Очищаем контейнер перед добавлением

  config.exterior.forEach((color, index) => {
    const button = document.createElement("button");
    button.innerHTML = `<img src="${color.imageUrl}" alt="${color.colorName}" width="75px">`;

    // Устанавливаем выбранный по умолчанию экстерьер
    if (index === 0) {
      nameExterior.textContent = color.colorName;
      priceExterior.textContent = formatPrice(color.price);
      selectedExteriorImages = color.carImageUrl;
      color.isSelected = true; // Отмечаем как выбранный
      button.classList.add("selected");
    } else {
      color.isSelected = false; // Отмечаем как не выбранный
    }

    button.addEventListener("click", () => {
      // Убираем статус выбора у предыдущего элемента
      config.exterior.forEach((exterior) => (exterior.isSelected = false));

      // Устанавливаем новый выбранный экстерьер
      color.isSelected = true;
      selectedExteriorImages = color.carImageUrl;

      // Обновляем UI
      document.querySelectorAll(".exterior .selected").forEach((btn) => {
        btn.classList.remove("selected");
      });
      button.classList.add("selected");
      nameExterior.textContent = color.colorName;
      priceExterior.textContent = formatPrice(color.price);

      // Пересчитываем итоговую цену
      const totalPrice = calculateTotalPrice(config);
      document.querySelector(".total-price").textContent =
        formatPrice(totalPrice);

      // Обновляем слайдер с новыми изображениями
      updateSlider(selectedExteriorImages.concat(selectedInteriorImages));
    });

    exteriorContainer.appendChild(button);
  });
}

// Отображение колес
function displayWheels(config) {
  const wheelsContainer = document.querySelector(".wheels .car__colors");
  const nameWheels = document.querySelector(".name__wheels");
  const priceWheels = document.querySelector(".price__wheels");

  wheelsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением

  config.wheels.forEach((wheel, index) => {
    const button = document.createElement("button");
    button.innerHTML = `<img src="${wheel.imageUrl}" alt="${wheel.name}" width="85px">`;

    if (index === 0) {
      nameWheels.textContent = wheel.name;
      priceWheels.textContent = formatPrice(wheel.price);
      wheel.isSelected = true; // Отмечаем как выбранный
      button.classList.add("selected");
    } else {
      wheel.isSelected = false; // Отмечаем как не выбранный
    }

    button.addEventListener("click", () => {
      // Снимаем отметку с предыдущего выбранного колеса
      config.wheels.forEach((wheel) => (wheel.isSelected = false));

      // Устанавливаем новое выбранное колесо
      wheel.isSelected = true;

      // Обновляем UI
      document.querySelectorAll(".wheels .selected").forEach((btn) => {
        btn.classList.remove("selected");
      });
      button.classList.add("selected");
      nameWheels.textContent = wheel.name;
      priceWheels.textContent = formatPrice(wheel.price);

      // Пересчет итоговой цены
      const totalPrice = calculateTotalPrice(config);
      document.querySelector(".total-price").textContent =
        formatPrice(totalPrice);

      // Обновляем слайдер с новыми изображениями
      updateSlider(selectedExteriorImages.concat(selectedInteriorImages));
    });

    wheelsContainer.appendChild(button);
  });
}

// Отображение интерьера
function displayInterior(config) {
  const interiorContainer = document.querySelector(".interior .car__colors");
  const nameInterior = document.querySelector(".name__interior");
  const priceInterior = document.querySelector(".price__interior");

  interiorContainer.innerHTML = ""; // Очищаем контейнер перед добавлением

  config.interior.forEach((interior, index) => {
    const button = document.createElement("button");
    button.innerHTML = `<img src="${interior.imageUrl}" alt="${interior.name}" width="80px">`;

    // Устанавливаем выбранный по умолчанию интерьер
    if (index === 0) {
      nameInterior.textContent = interior.name;
      priceInterior.textContent = formatPrice(interior.price);
      selectedInteriorImages = interior.interiorImageUrl;
      interior.isSelected = true; // Отмечаем как выбранный
      button.classList.add("selected");
    } else {
      interior.isSelected = false; // Отмечаем как не выбранный
    }

    button.addEventListener("click", () => {
      // Снимаем статус выбора у предыдущего интерьера
      config.interior.forEach((interior) => (interior.isSelected = false));

      // Устанавливаем новый выбранный интерьер
      interior.isSelected = true;
      selectedInteriorImages = interior.interiorImageUrl;

      // Обновляем UI
      document.querySelectorAll(".interior .selected").forEach((btn) => {
        btn.classList.remove("selected");
      });
      button.classList.add("selected");
      nameInterior.textContent = interior.name;
      priceInterior.textContent = formatPrice(interior.price);

      // Пересчитываем итоговую цену
      const totalPrice = calculateTotalPrice(config);
      document.querySelector(".total-price").textContent =
        formatPrice(totalPrice);

      // Обновляем слайдер с новыми изображениями
      updateSlider(selectedExteriorImages.concat(selectedInteriorImages));
    });

    interiorContainer.appendChild(button);
  });
}

// Функция для отображения пакета
function displayPacket(config, modelName) {
  const packetContainer = document.querySelector(".packet-main");
  const namePacket = document.querySelector(".name__packet");
  const infoPacket = document.querySelector(".info__packet");
  const pricePacket = document.querySelector(".price__packet");
  const packetImage = document.querySelector(".packet img");
  const packetToggle = document.getElementById("packet-toggle"); // Чекбокс

  // Скрываем секцию пакетов, если их нет
  document.querySelector(".packet").style.display = "none";

  // Проверяем, есть ли пакеты и соответствующая модель
  if (config.packet && config.packet.length > 0) {
    const packet = config.packet[0];
    namePacket.textContent = packet.name;
    infoPacket.textContent = packet.info;
    pricePacket.textContent = formatPrice(packet.price);
    packetImage.src = packet.imagePacketUrl;

    // Отображаем секцию пакетов
    document.querySelector(".packet").style.display = "block";

    // Логика для Zeekr X Премиум AWD: показываем чекбокс для выбора пакета
    if (modelName === "Zeekr X" && config.name != "Флагман AWD") {
      packetToggle.style.display = "block"; // Показываем чекбокс

      // Обработчик события переключения чекбокса
      packetToggle.addEventListener("change", () => {
        if (packetToggle.checked) {
          packetContainer.classList.add("selected");
        } else {
          packetContainer.classList.remove("selected");
        }
        // Пересчитываем общую цену
        calculateTotalPrice(config);
      });
    } else {
      // Логика для других конфигураций или моделей, включая Флагман AWD
      packetToggle.style.display = "none"; // Скрываем чекбокс

      // Пакет выбран по умолчанию для Флагман AWD или других моделей
      packetContainer.classList.add("selected");
    }
  }
}

// Обновление слайдера
function updateSlider(imageUrls) {
  let currentIndex = 0;
  const sliderImage = document.querySelector("#slider-image");
  const thumbnailsContainer = document.querySelector("#thumbnails");

  sliderImage.src = imageUrls[currentIndex];
  sliderImage.classList.add("show");

  thumbnailsContainer.innerHTML = "";

  imageUrls.forEach((url, index) => {
    const thumbnail = document.createElement("img");
    thumbnail.src = url;
    thumbnail.addEventListener("click", () => {
      currentIndex = index;
      changeImage(url);
    });
    thumbnailsContainer.appendChild(thumbnail);
  });

  document.querySelector("#prev-image").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
    changeImage(imageUrls[currentIndex]);
  });

  document.querySelector("#next-image").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % imageUrls.length;
    changeImage(imageUrls[currentIndex]);
  });

  function changeImage(url) {
    sliderImage.classList.remove("show");
    setTimeout(() => {
      sliderImage.src = url;
      sliderImage.classList.add("show");
    }, 200);
  }

  let touchStartX = 0;
  let touchEndX = 0;

  sliderImage.addEventListener("touchstart", handleTouchStart, false);
  sliderImage.addEventListener("touchmove", handleTouchMove, false);
  sliderImage.addEventListener("touchend", handleTouchEnd, false);

  function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
  }

  function handleTouchMove(event) {
    touchEndX = event.changedTouches[0].screenX;
  }

  function handleTouchEnd() {
    if (touchStartX - touchEndX > 50) {
      currentIndex = (currentIndex + 1) % imageUrls.length;
      changeImage(imageUrls[currentIndex]);
    }
    if (touchEndX - touchStartX > 50) {
      currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
      changeImage(imageUrls[currentIndex]);
    }
  }
}

// Вычисление итоговой цены
// Функция для вычисления итоговой цены с учетом всех опций и пакета
function calculateTotalPrice(config) {
  let totalPrice = config.price;

  // Учитываем выбранный экстерьер
  const selectedExterior = config.exterior.find(
    (exterior) => exterior.isSelected
  );
  if (selectedExterior) {
    totalPrice += selectedExterior.price;
  }

  // Учитываем выбранные колеса
  const selectedWheel = config.wheels.find((wheel) => wheel.isSelected);
  if (selectedWheel) {
    totalPrice += selectedWheel.price;
  }

  // Учитываем выбранный интерьер
  const selectedInterior = config.interior.find(
    (interior) => interior.isSelected
  );
  if (selectedInterior) {
    totalPrice += selectedInterior.price || 0;
  }

  // Учитываем пакет, если он выбран
  const packetContainer = document.querySelector(".packet-main");
  const selectedPacket = packetContainer?.classList.contains("selected");

  if (config.packet && config.packet.length > 0 && selectedPacket) {
    const packet = config.packet[0]; // Предполагаем, что есть только один пакет
    totalPrice += packet.price; // Добавляем цену пакета
  }

  // Обновляем отображение итоговой цены
  document.querySelector(".total-price").textContent = formatPrice(totalPrice);

  return totalPrice;
}

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const request = document.querySelector(".request");
  const button = document.getElementById("add-section-button");
  const secondSubmitButton = document.getElementById("secondSubmitButton");
  const form = document.querySelector("#customer-form");
  const errorMessage = document.querySelector("#error-message");
  const submitButton = document.querySelector("#submitButton");
  const backButton = document.querySelector("#back-button");
  const step2 = document.querySelector(".step2");
  const circle2 = document.querySelector(".circle2");
  const checkboxErrorMessage = document.querySelector(
    "#checkbox-error-message"
  );
  const btnText = document.querySelector("#btnText");

  request.style.display = "none";
  secondSubmitButton.style.display = "none"; // Скрыть secondSubmitButton изначально

  // Событие на кнопку "Продолжить"
button.addEventListener("click", () => {
  if (request.style.display === "none") {
    sidebar.style.display = "none";
    request.style.display = "block";
    secondSubmitButton.style.display = "block";
    button.style.display = "none";
      step2.style.color = "black";
      circle2.style.borderColor = "black";
  }
});

backButton.addEventListener("click", () => {
  sidebar.style.display = "block"; // Показываем боковую панель
  request.style.display = "none"; // Скрываем запрос
  secondSubmitButton.style.display = "none"; // Скрываем вторую кнопку отправки
  button.style.display = "block"; // Показываем основную кнопку
});



  // Валидация и отправка формы при нажатии на secondSubmitButton
  secondSubmitButton.addEventListener("click", (event) => {

    event.preventDefault(); // Предотвращение стандартного поведения формы

    // Сброс предыдущих сообщений об ошибках
    errorMessage.style.display = "none";
    checkboxErrorMessage.style.display = "none";

    let valid = true;

    // Проверка полей формы
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const phone = document.getElementById("phone");
    const consent = document.querySelector("#consent");

    if (!firstName.value) {
      valid = false;
      firstName.style.borderColor = "red";
    } else {
      firstName.style.borderColor = "";
    }

    if (!lastName.value) {
      valid = false;
      lastName.style.borderColor = "red";
    } else {
      lastName.style.borderColor = "";
    }

    if (!phone.value) {
      valid = false;
      phone.style.borderColor = "red";
    } else {
      phone.style.borderColor = "";
    }

    if (!consent.checked) {
      valid = false;
      checkboxErrorMessage.innerHTML =
        "Необходимо подтвердить согласие на обработку данных";
      checkboxErrorMessage.style.display = "block";
    }

    // Если форма валидна
    if (valid) {
      submitButton.click();
      btnText.innerHTML = "";
      btnText.innerHTML = "Отправлено"; // Изменение текста кнопки на "Отправлено"
      secondSubmitButton.classList.add("active");

      // Здесь можно добавить действие по отправке формы, если нужно
      // form.submit();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Получаем текущий месяц
  const months = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];
  const currentDate = new Date();
  const currentMonth = months[currentDate.getMonth()]; // Получаем название месяца
  document.getElementById("current-month").textContent = currentMonth; // Устанавливаем текст
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("add-section-button")
    .addEventListener("click", () => {
      const selectedModel = document.querySelector(".names").textContent;
      const selectedConfiguration = document.querySelector(
        ".equipment.main_conf.selected .equipment__name"
      ).textContent;

      // Используем цену без блока "с учетом Trade-In"
      const selectedModelPrice = document.querySelector(
        ".equipment.main_conf.selected .equipment__price span.tradein"
      ).textContent;

      const selectedExteriorColor =
        document.querySelector(".name__exterior").textContent;
      const exteriorColorPrice =
        document.querySelector(".price__exterior").textContent;
      const selectedWheels =
        document.querySelector(".name__wheels").textContent;
      const selectedWheelsPrice =
        document.querySelector(".price__wheels").textContent;
      const selectedInterior =
        document.querySelector(".name__interior").textContent;
      const selectedInteriorPrice =
        document.querySelector(".price__interior").textContent;
      const selectedPacket =
        document.querySelector(".name__packet").textContent;
      const selectedPacketPrice =
        document.querySelector(".price__packet").textContent;
      const totalPrice = document.querySelector(".total-price").textContent;

      selectedCar = {
        model: selectedModel,
        model_price: Number(selectedModelPrice.replace(/\D/g, "")), // Удаление всех символов кроме цифр
        configuration: selectedConfiguration,
        exteriorColor: selectedExteriorColor,
        exteriorColorPrice: Number(exteriorColorPrice.replace(/\D/g, "")),
        wheels: selectedWheels,
        wheels_price: Number(selectedWheelsPrice.replace(/\D/g, "")),
        interior: selectedInterior,
        interior_price: Number(selectedInteriorPrice.replace(/\D/g, "")),
        packet: selectedPacket,
        packet_price: Number(selectedPacketPrice.replace(/\D/g, "")),
        totalPrice: Number(totalPrice.replace(/\D/g, "")),
      };

      // Отправляем данные модели без блока "Trade-In"
      document.querySelector(".model__").textContent = selectedCar.model;
      document.querySelector(".model__price").textContent = formatPrice(
        selectedCar.model_price
      );
      document.querySelector(".configuration__").textContent =
        selectedCar.configuration;
      document.querySelector(".exteriorColor__").textContent =
        selectedCar.exteriorColor;
      document.querySelector(".exteriorColor__price").textContent = formatPrice(
        selectedCar.exteriorColorPrice
      );
      document.querySelector(".wheels__").textContent = selectedCar.wheels;
      document.querySelector(".wheels__price").textContent = formatPrice(
        selectedCar.wheels_price
      );
      document.querySelector(".interior__").textContent = selectedCar.interior;
      document.querySelector(".interior__price").textContent = formatPrice(
        selectedCar.interior_price
      );

      // Update the packet price display for Zeekr X
      if (selectedCar.model === "Zeekr X") {
        document.querySelector(".packet__").textContent = selectedCar.packet;
        document.querySelector(".packet__price").textContent = formatPrice(
          selectedCar.packet_price // Use the correct packet price
        );
      } else {
      }

      document.querySelector(".totalPrice__").textContent = formatPrice(
        selectedCar.totalPrice
      );
    });
});

document
  .getElementById("customer-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    formData = {
      firstName: document.getElementById("first-name").value,
      lastName: document.getElementById("last-name").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      dealer: document.getElementById("dealer").value,
    };
    document.getElementById("customer-form").reset();

    const getFullBaseData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      dealer: formData.dealer,
      model: selectedCar.model,
      model_price: formatPrice(selectedCar.model_price),
      configuration: selectedCar.configuration,
      exteriorColor: selectedCar.exteriorColor,
      exteriorColorPrice: formatPrice(selectedCar.exteriorColorPrice),
      wheels: selectedCar.wheels,
      wheels_price: formatPrice(selectedCar.wheels_price),
      interior: selectedCar.interior,
      interior_price: formatPrice(selectedCar.interior_price),
      totalPrice: formatPrice(selectedCar.totalPrice),
    };

    console.log("Full form and car data:", getFullBaseData);
  });

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector('a[href="#"]')
    .addEventListener("click", function (event) {
      event.preventDefault(); // предотвращаем действие по умолчанию ссылки
      toggleText();
    });

  function toggleText() {
    var text = document.getElementById("text");
    if (text.style.display === "none" || text.style.display === "") {
      text.style.display = "block";
    } else {
      text.style.display = "none";
    }
  }
});

document.querySelector("#phone").onkeydown = function (e) {
  inputphone(e, document.querySelector("#phone"));
};

function inputphone(e, phone) {
  function stop(evt) {
    evt.preventDefault();
  }

  let key = e.key,
    v = phone.value;

  // Allow only digits and the Backspace key
  if (!/[0-9]/.test(key) && key !== "Backspace") {
    stop(e);
    return;
  }

  if (key !== "Backspace") {
    if (v.length < 4 || v === "") {
      phone.value = "+7 (";
    }
    if (v.length === 7) {
      phone.value = v + ") ";
    }
    if (v.length === 12) {
      phone.value = v + "-";
    }
    if (v.length === 15) {
      phone.value = v + "-";
    }
  }
}

const submitButton = document.querySelector("#submitButton");
const btnText = document.querySelector("#btnText");
const form = document.querySelector("#customer-form");
const errorMessage = document.querySelector("#error-message");
const checkboxErrorMessage = document.querySelector("#checkbox-error-message");

submitButton.onclick = (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Reset error messages and previous styles
  errorMessage.style.display = "none";
  errorMessage.innerHTML = "";
  checkboxErrorMessage.style.display = "none";
  checkboxErrorMessage.innerHTML = "";

  // Validate each field
  let valid = true;

  // Validate first name
  const firstName = document.getElementById("first-name");
  if (!firstName.value) {
    valid = false;
    firstName.style.borderColor = "red"; // Highlight the field in red
  } else {
    firstName.style.borderColor = ""; // Reset styles
  }

  // Validate last name
  const lastName = document.getElementById("last-name");
  if (!lastName.value) {
    valid = false;
    lastName.style.borderColor = "red"; // Highlight the field in red
  } else {
    lastName.style.borderColor = ""; // Reset styles
  }

  // Validate phone
  const phone = document.getElementById("phone");
  if (!phone.value) {
    valid = false;
    phone.style.borderColor = "red"; // Highlight the field in red
  } else {
    phone.style.borderColor = ""; // Reset styles
  }

  // Validate consent checkbox
  const consent = document.querySelector("#consent");
  if (!consent.checked) {
    valid = false;
    checkboxErrorMessage.innerHTML =
      "Необходимо подтвердить согласие на обработку данных";
    checkboxErrorMessage.style.display = "block"; // Show error message
  }

  // If all fields are valid
  if (valid) {
    btnText.innerHTML = "Отправлено"; // Change button text to "Отправлено"
    submitButton.classList.add("active");

    // Capture form data
    formData = {
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phone.value,
      email: email.value,
      dealer: document.getElementById("dealer").value,
      model: selectedCar.model,
      model_price: formatPrice(selectedCar.model_price),
      configuration: selectedCar.configuration,
      exteriorColor: selectedCar.exteriorColor,
      exteriorColorPrice: formatPrice(selectedCar.exteriorColorPrice),
      wheels: selectedCar.wheels,
      wheels_price: formatPrice(selectedCar.wheels_price),
      interior: selectedCar.interior,
      interior_price: formatPrice(selectedCar.interior_price),
      totalPrice: formatPrice(selectedCar.totalPrice),
    };

    // Log the form data to the console
    console.log("Form data submitted:", formData);

    // Optionally submit the form if desired
    // form.submit();
  } else {
    console.log("Form validation failed");
  }
};
