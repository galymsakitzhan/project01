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
  document.querySelector(".names").textContent = model.name;

  displayModifications(selectedConfig);
  displayExterior(selectedConfig); // Обновляем экстерьер
  displayWheels(selectedConfig); // Обновляем колеса
  displayInterior(selectedConfig); // Обновляем интерьер

  // Устанавливаем слайдер с изображениями первого экстерьера и интерьера
  selectedExteriorImages = selectedConfig.exterior[0].carImageUrl;
  selectedInteriorImages = selectedConfig.interior[0].interiorImageUrl;
  updateSlider(selectedExteriorImages.concat(selectedInteriorImages));

  const totalPrice = calculateTotalPrice(selectedConfig);
  document.querySelector(".total-price").textContent = formatPrice(totalPrice);
  displayPacket(selectedConfig, model.name);
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
    button.innerHTML = `<img src="${color.imageUrl}" alt="${color.colorName}" width="80px">`;

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
    button.innerHTML = `<img src="${wheel.imageUrl}" alt="${wheel.name}" width="90px">`;

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
    button.innerHTML = `<img src="${interior.imageUrl}" alt="${interior.name}" width="85px">`;

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
          packetContainer.style.border = "2px solid orange"; // Подсветка выбранного пакета
        } else {
          packetContainer.classList.remove("selected");
          packetContainer.style.border = "none"; // Убираем подсветку
        }
        // Пересчитываем общую цену
        calculateTotalPrice(config);
      });
    } else {
      // Логика для других конфигураций или моделей, включая Флагман AWD
      packetToggle.style.display = "none"; // Скрываем чекбокс

      // Пакет выбран по умолчанию для Флагман AWD или других моделей
      packetContainer.classList.add("selected");
      packetContainer.style.border = "2px solid orange";
    }
  }
}



// Обновите логику, которая собирает данные после выбора пакета
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("add-section-button")
    .addEventListener("click", () => {
      const selectedModel = document.querySelector(".names").textContent;
      const selectedConfiguration = document.querySelector(
        ".equipment.main_conf.select .equipment__name"
      ).textContent;

      const selectedModelPrice = document.querySelector(
        ".equipment.main_conf.select .equipment__price span.tradein"
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

      // Проверяем состояние чекбокса для пакета
      const packetToggle = document.getElementById("packet-toggle");
      let selectedPacket = "";
      let selectedPacketPrice = 0;

      if (packetToggle.checked) {
        selectedPacket = document.querySelector(".name__packet").textContent;
        selectedPacketPrice = Number(
          document
            .querySelector(".price__packet")
            .textContent.replace(/\D/g, "")
        );
      }

      const totalPrice = document.querySelector(".total-price").textContent;

      selectedCar = {
        model: selectedModel,
        model_price: Number(selectedModelPrice.replace(/\D/g, "")),
        configuration: selectedConfiguration,
        exteriorColor: selectedExteriorColor,
        exteriorColorPrice: Number(exteriorColorPrice.replace(/\D/g, "")),
        wheels: selectedWheels,
        wheels_price: Number(selectedWheelsPrice.replace(/\D/g, "")),
        interior: selectedInterior,
        interior_price: Number(selectedInteriorPrice.replace(/\D/g, "")),
        packet: selectedPacket,
        packet_price: selectedPacketPrice,
        totalPrice: Number(totalPrice.replace(/\D/g, "")),
      };

      // Обновляем отображение данных
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

      // Обновляем информацию о пакете
      if (selectedCar.packet) {
        document.querySelector(".packet__").textContent = selectedCar.packet;
        document.querySelector(".packet__price").textContent = formatPrice(
          selectedCar.packet_price
        );
      } else {
        document.querySelector(".packet__").textContent = "";
        document.querySelector(".packet__price").textContent = "";
      }

      document.querySelector(".totalPrice__").textContent = formatPrice(
        selectedCar.totalPrice
      );
    });
});



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

  request.style.display = "none";

  button.addEventListener("click", () => {
    if (request.style.display === "none") {
      sidebar.style.display = "none";
      request.style.display = "block";
    } else {
      sidebar.style.display = "block";
      request.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const request = document.querySelector(".request");
  const button1 = document.getElementById("back-button");

  button1.addEventListener("click", () => {
    if (request.style.display === "none") {
      sidebar.style.display = "none";
      request.style.display = "block";
    } else {
      sidebar.style.display = "block";
      request.style.display = "none";
    }
  });
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

      // Проверяем, выбран ли пакет (содержит ли элемент класс "selected")
      const packetContainer = document.querySelector(".packet-main");
      let selectedPacket = "";
      let selectedPacketPrice = 0;

      if (packetContainer.classList.contains("selected")) {
        selectedPacket = document.querySelector(".name__packet").textContent;
        selectedPacketPrice = Number(
          document
            .querySelector(".price__packet")
            .textContent.replace(/\D/g, "")
        );
      }

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
        packet_price: selectedPacketPrice,
        totalPrice: Number(totalPrice.replace(/\D/g, "")),
      };

      // Обновляем данные модели
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

      // Обновляем отображение пакета только если он выбран
      if (selectedCar.packet) {
        document.querySelector(".packet__").textContent = selectedCar.packet;
        document.querySelector(".packet__price").textContent = formatPrice(
          selectedCar.packet_price
        );
      } else {
        // Если пакет не выбран, скрываем информацию о пакете
        document.querySelector(".packet__").textContent = "";
        document.querySelector(".packet__price").textContent = "";
      }

      // Обновляем итоговую цену
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
