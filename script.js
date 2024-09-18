import { carData } from "./data.js";

let selectedExteriorImages = [];
let selectedInteriorImages = [];


// function -> choosing default car
document.addEventListener("DOMContentLoaded", () => {
  const selectedModel = carData.models[0];
  displayConfigurations(selectedModel);
});


// function -> (displayConfigurations)
function displayConfigurations(model) {
  const equipmentContainer = document.querySelector(".option__car");
  equipmentContainer.innerHTML = "";
  model.configurations.forEach((config, index) => {

    const configDiv = document.createElement("div");
    configDiv.classList.add("main_conf");
    configDiv.classList.add("equipment");

    const configName = document.createElement("div");
    configName.classList.add("equipment__name");
    configName.textContent = config.name;

    const configPrice = document.createElement("div");
    configPrice.classList.add("equipment__price");
    configPrice.textContent = `${config.price}₸`;

    configDiv.appendChild(configName);
    configDiv.appendChild(configPrice);

    configDiv.addEventListener("click", () => {
      const previouslySelected = document.querySelector(".equipment.selected");
      if (previouslySelected) {
        previouslySelected.classList.remove("selected");
      }
      configDiv.classList.add("selected");

      renderCarData(model, config);
    });

        if (index === 0) {
          configDiv.click();
        }
    equipmentContainer.appendChild(configDiv);
  });
}


// function -> (renderCarData)
function renderCarData(model, selectedConfig) {
  document.querySelector(".names").textContent = model.name;

  displayModifications(selectedConfig);
  displayExterior(selectedConfig);
  displayWheels(selectedConfig);
  displayInterior(selectedConfig);

  if (selectedConfig.exterior.length > 0) {
    selectedExteriorImages = selectedConfig.exterior[0].carImageUrl;
  }
  if (selectedConfig.interior.length > 0) {
    selectedInteriorImages = selectedConfig.interior[0].interiorImageUrl;
  }
  updateSlider(selectedExteriorImages.concat(selectedInteriorImages));

  const totalPrice = calculateTotalPrice(selectedConfig);
  document.querySelector(".total-price").textContent = `${totalPrice}₸`;
}


// function -> (adding modification text about car)
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



function displayExterior(config) {
  const exteriorContainer = document.querySelector(".exterior .car__colors");
  const nameExterior = document.querySelector(".name__exterior");
  const priceExterior = document.querySelector(".price__exterior");

  exteriorContainer.innerHTML = ""; // Очищаем контейнер перед добавлением

  config.exterior.forEach((color, index) => {
    const button = document.createElement("button");
    button.innerHTML = `<img src="${color.imageUrl}" alt="${color.colorName}" width="80px">`;
    button.dataset.carImageUrl = JSON.stringify(color.carImageUrl); // Сохраняем массив изображений в атрибуте data

    // Устанавливаем первое имя и цену по умолчанию
    if (index === 0 && selectedExteriorImages.length === 0) {
      nameExterior.textContent = color.colorName;
      priceExterior.textContent = `${color.price}₸`;
      selectedExteriorImages = color.carImageUrl; // Инициализируем выбранный экстерьер
      color.isSelected = true; // Отмечаем первый цвет как выбранный
    } else {
      color.isSelected = false;
    }

    button.addEventListener("click", () => {
      const previousColor = config.exterior.find((c) => c.isSelected);
      if (previousColor) previousColor.isSelected = false;

      color.isSelected = true; // Отмечаем выбранный цвет
      selectedExteriorImages = color.carImageUrl; // Обновляем выбранные изображения экстерьера

      nameExterior.textContent = color.colorName;
      priceExterior.textContent = `${color.price}₸`;

      // Обновляем массив изображений для машины
      updateSlider(selectedExteriorImages.concat(selectedInteriorImages)); // Объединяем картинки для слайдера

      // Обновляем общую цену
      const totalPrice = calculateTotalPrice(config);
      document.querySelector(".total-price").textContent = `${totalPrice}₸`;
    });

    exteriorContainer.appendChild(button);
  });
}


function displayWheels(config) {
  const wheelsContainer = document.querySelector(".wheels .car__colors");
  const nameWheels = document.querySelector(".name__wheels");
  const priceWheels = document.querySelector(".price__wheels");

  wheelsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением

  config.wheels.forEach((wheel, index) => {
    const button = document.createElement("button");
    button.classList.add("wheel__button");
    button.innerHTML = `<img src="${wheel.imageUrl}" alt="${wheel.name}" width="90px">`;

    // Устанавливаем имя и цену первого колеса по умолчанию
    if (index === 0 && selectedInteriorImages.length === 0) {
      nameWheels.textContent = wheel.name;
      priceWheels.textContent = `${wheel.price}₸`;
      wheel.isSelected = true; // Отмечаем первое колесо как выбранное
    } else {
      wheel.isSelected = false;
    }

    button.addEventListener("click", () => {
      const previousWheel = config.wheels.find((w) => w.isSelected);
      if (previousWheel) previousWheel.isSelected = false;

      wheel.isSelected = true; // Отмечаем выбранное колесо

      nameWheels.textContent = wheel.name;
      priceWheels.textContent = `${wheel.price}₸`; // Обновляем цену колес

      // Обновляем общую цену
      const totalPrice = calculateTotalPrice(config);
      document.querySelector(
        ".total-price"
      ).textContent = `Итоговая цена: ${totalPrice}₸`;
    });

    wheelsContainer.appendChild(button);
  });
}


function displayInterior(config) {
  const interiorContainer = document.querySelector(".interior .car__colors");
  const nameInterior = document.querySelector(".name__interior");
  const priceInterior = document.querySelector(".price__interior");

  interiorContainer.innerHTML = ""; // Очищаем контейнер перед добавлением

  config.interior.forEach((interior, index) => {
    const button = document.createElement("button");
    button.innerHTML = `<img src="${interior.imageUrl}" alt="${interior.name}" width="85px">`;

    // Устанавливаем первое имя и цену по умолчанию
    if (index === 0 && selectedInteriorImages.length === 0) {
      nameInterior.textContent = interior.name;
      priceInterior.textContent = `${interior.price || 0}₸`; // Если цена есть, выводим, иначе 0
      selectedInteriorImages = interior.interiorImageUrl; // Инициализируем выбранный интерьер
      interior.isSelected = true; // Отмечаем первый интерьер как выбранный
    } else {
      interior.isSelected = false;
    }

    button.addEventListener("click", () => {
      const previousInterior = config.interior.find((i) => i.isSelected);
      if (previousInterior) previousInterior.isSelected = false;

      interior.isSelected = true; // Отмечаем выбранный интерьер
      selectedInteriorImages = interior.interiorImageUrl; // Обновляем выбранные изображения интерьера

      nameInterior.textContent = interior.name;
      priceInterior.textContent = `${interior.price || 0}₸`; // Обновляем цену интерьера

      // Обновляем массив изображений интерьера
      updateSlider(selectedExteriorImages.concat(selectedInteriorImages)); // Объединяем картинки для слайдера

      // Обновляем общую цену
      const totalPrice = calculateTotalPrice(config);
      document.querySelector(
        ".total-price"
      ).textContent = `Итоговая цена: ${totalPrice}₸`;
    });

    interiorContainer.appendChild(button);
  });
}

// Функция для переключения изображений в слайдере
function updateSlider(imageUrls) {
  let currentIndex = 0;
  const sliderImage = document.querySelector("#slider-image");
  const thumbnailsContainer = document.querySelector("#thumbnails");

  // Отображаем первое изображение
  sliderImage.src = imageUrls[currentIndex];
  sliderImage.classList.add("show");

  // Очищаем контейнер миниатюр перед добавлением новых
  thumbnailsContainer.innerHTML = "";

  // Создаем миниатюры для каждого изображения
  imageUrls.forEach((url, index) => {
    const thumbnail = document.createElement("img");
    thumbnail.src = url;
    thumbnail.addEventListener("click", () => {
      currentIndex = index;
      changeImage(url);
    });
    thumbnailsContainer.appendChild(thumbnail);
  });

  // Добавляем обработчики событий для кнопок переключения
  document.querySelector("#prev-image").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
    changeImage(imageUrls[currentIndex]);
  });

  document.querySelector("#next-image").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % imageUrls.length;
    changeImage(imageUrls[currentIndex]);
  });

  // Функция для смены изображения с анимацией
  function changeImage(url) {
    sliderImage.classList.remove("show"); // Убираем класс перед сменой
    setTimeout(() => {
      sliderImage.src = url; // Меняем изображение
      sliderImage.classList.add("show"); // Добавляем класс снова для анимации
    }, 200); // Время задержки для плавного перехода
  }

  // Логика для свайпа на мобильных устройствах
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
      // Свайп влево - показать следующее изображение
      currentIndex = (currentIndex + 1) % imageUrls.length;
      changeImage(imageUrls[currentIndex]);
    }
    if (touchEndX - touchStartX > 50) {
      // Свайп вправо - показать предыдущее изображение
      currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
      changeImage(imageUrls[currentIndex]);
    }
  }
}





function calculateTotalPrice(config) {
  let totalPrice = config.price;
  // Добавляем цену выбранного цвета
  const selectedExterior = config.exterior.find((ex) => ex.isSelected);
  if (selectedExterior) {
    totalPrice += selectedExterior.price;
  }
  // Добавляем цену выбранного колеса
  const selectedWheel = config.wheels.find((w) => w.isSelected);
  if (selectedWheel) totalPrice += selectedWheel.price;
  // Добавляем цену выбранного интерьера
  const selectedInterior = config.interior.find((i) => i.isSelected);
  if (selectedInterior) totalPrice += selectedInterior.price || 0;
  return totalPrice;
}


// Инициализация данных при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  const selectedModel = carData.models[0]; // Выбираем первую модель для отображения

  // Отображаем конфигурации модели как кнопки
  displayConfigurations(selectedModel);

  // Отображаем данные для первой конфигурации по умолчанию
  renderCarData(selectedModel, selectedModel.configurations[0]);
});

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const request = document.querySelector(".request");
  const button = document.getElementById("add-section-button");

  // Изначально скрыть section.request и показать section.sidebar
  request.style.display = "none";

  button.addEventListener("click", () => {
    // Переключить видимость секций
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


let selectedCar = {};
let formData = {};

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("add-section-button")
    .addEventListener("click", () => {
      const selectedModel = document.querySelector(".names").textContent;
      const selectedConfiguration = document.querySelector(
        ".equipment.main_conf.selected .equipment__name"
      ).textContent;
      const selectedModelPrice =
        document.querySelector(".equipment__price").textContent;
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
      const totalPrice = document.querySelector(".total-price").textContent;

      selectedCar = {
        model: selectedModel,
        model_price: selectedModelPrice,
        configuration: selectedConfiguration,
        exteriorColor: selectedExteriorColor,
        exteriorColorPrice: exteriorColorPrice,
        wheels: selectedWheels,
        wheels_price: selectedWheelsPrice,
        interior: selectedInterior,
        interior_price: selectedInteriorPrice,
        totalPrice: totalPrice,
      };

      document.querySelector(".model__").textContent = selectedCar.model;
      document.querySelector(".model__price").textContent =
        selectedCar.model_price;
      document.querySelector(".configuration__").textContent =
        selectedCar.configuration;
      document.querySelector(".exteriorColor__").textContent =
        selectedCar.exteriorColor;
      document.querySelector(".exteriorColor__price").textContent =
        selectedCar.exteriorColorPrice;
      document.querySelector(".wheels__").textContent = selectedCar.wheels;
      document.querySelector(".wheels__price").textContent =
        selectedCar.wheels_price;
      document.querySelector(".interior__").textContent = selectedCar.interior;
      document.querySelector(".interior__price").textContent =
        selectedCar.interior_price;
      document.querySelector(".totalPrice__").textContent =
        selectedCar.totalPrice;
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
      model: selectedCar.model,
      model_price: selectedCar.model_price,
      configuration: selectedCar.configuration,
      exteriorColor: selectedCar.exteriorColor,
      exteriorColorPrice: selectedCar.exteriorColorPrice,
      wheels: selectedCar.wheels,
      wheels_price: selectedCar.wheels_price,
      interior: selectedCar.interior,
      interior_price: selectedCar.interior_price,
      totalPrice: selectedCar.totalPrice,
    };

    console.log("Full form and car data:", getFullBaseData);
  });
