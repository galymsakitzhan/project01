import { carData } from "./data.js";

let selectedExteriorImages = [];
let selectedInteriorImages = [];

// Function to format numbers with thousands separators
function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    minimumFractionDigits: 0, // Не отображаем дробные части
    maximumFractionDigits: 0, // Не отображаем дробные части
  }).format(price);
}

// function -> choosing default car
document.addEventListener("DOMContentLoaded", () => {
  const selectedModel = carData.models[0];
  displayConfigurations(selectedModel);
});

// Function to create price element with or without Trade-In
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

    // Создание элементов цены
    const configPriceWithTradeIn = createPriceElement(config, true);
    const configPriceWithoutTradeIn = createPriceElement(config, false);

    // Добавление цены с учетом Trade-In по умолчанию
    configDiv.appendChild(configName);
    configDiv.appendChild(configPriceWithTradeIn);

    configDiv.addEventListener("click", () => {
      // Сбрасываем предыдущий выбор
      const previouslySelected = document.querySelector(".equipment.selected");
      if (previouslySelected) {
        previouslySelected.classList.remove("selected");
      }

      // Сбрасываем бордеры в экстерьере
      const selectedExteriorButton = document.querySelector(
        ".exterior .selected"
      );
      if (selectedExteriorButton) {
        selectedExteriorButton.classList.remove("selected");
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
  document.querySelector(".total-price").textContent = `${formatPrice(
    totalPrice
  )}`;
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
    button.dataset.carImageUrl = JSON.stringify(color.carImageUrl);

    // Устанавливаем начальный выбор
    if (index === 0 && selectedExteriorImages.length === 0) {
      nameExterior.textContent = color.colorName;
      priceExterior.textContent = `${formatPrice(color.price)}`;
      selectedExteriorImages = color.carImageUrl;
      color.isSelected = true;
      button.classList.add("selected");
    } else {
      color.isSelected = false;
    }

    button.addEventListener("click", () => {
      // Сбрасываем предыдущий выбранный элемент в экстерьере
      const previousColor = config.exterior.find((c) => c.isSelected);
      if (previousColor) {
        previousColor.isSelected = false;
        const previousSelectedButton = document.querySelector(
          ".exterior .selected"
        );
        if (previousSelectedButton) {
          previousSelectedButton.classList.remove("selected");
        }
      }

      // Устанавливаем новый выбор
      color.isSelected = true;
      selectedExteriorImages = color.carImageUrl;
      button.classList.add("selected");

      nameExterior.textContent = color.colorName;
      priceExterior.textContent = `${formatPrice(color.price)}`;

      updateSlider(selectedExteriorImages.concat(selectedInteriorImages));
      const totalPrice = calculateTotalPrice(config);
      document.querySelector(".total-price").textContent = `${formatPrice(
        totalPrice
      )}`;
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

    // Устанавливаем начальный выбор
    if (index === 0 && selectedInteriorImages.length === 0) {
      nameWheels.textContent = wheel.name;
      priceWheels.textContent = `${formatPrice(wheel.price)}`;
      wheel.isSelected = true;
      button.classList.add("selected");
    } else {
      wheel.isSelected = false;
    }

    button.addEventListener("click", () => {
      // Убираем бордер у предыдущего выбранного элемента
      const previousWheel = config.wheels.find((w) => w.isSelected);
      if (previousWheel) {
        previousWheel.isSelected = false;
        const previousSelectedButton =
          document.querySelector(".wheels .selected");
        if (previousSelectedButton) {
          previousSelectedButton.classList.remove("selected");
        }
      }

      // Устанавливаем новый выбор
      wheel.isSelected = true;
      button.classList.add("selected");

      nameWheels.textContent = wheel.name;
      priceWheels.textContent = `${formatPrice(wheel.price)}`;

      const totalPrice = calculateTotalPrice(config);
      document.querySelector(".total-price").textContent = `${formatPrice(
        totalPrice
      )}`;
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

    if (index === 0 && selectedInteriorImages.length === 0) {
      nameInterior.textContent = interior.name;
      priceInterior.textContent = `${formatPrice(interior.price || 0)}`;
      selectedInteriorImages = interior.interiorImageUrl;
      interior.isSelected = true;
      button.classList.add("selected");
    } else {
      interior.isSelected = false;
    }

    button.addEventListener("click", () => {
      // Убираем бордер у предыдущего выбранного элемента
      const previousInterior = config.interior.find((i) => i.isSelected);
      if (previousInterior) {
        previousInterior.isSelected = false;
        const previousSelectedButton = document.querySelector(
          ".interior .selected"
        );
        if (previousSelectedButton) {
          previousSelectedButton.classList.remove("selected");
        }
      }

      // Устанавливаем новый выбор
      interior.isSelected = true;
      selectedInteriorImages = interior.interiorImageUrl;
      button.classList.add("selected");

      nameInterior.textContent = interior.name;
      priceInterior.textContent = `${formatPrice(interior.price || 0)}`;

      updateSlider(selectedExteriorImages.concat(selectedInteriorImages));

      const totalPrice = calculateTotalPrice(config);
      document.querySelector(".total-price").textContent = `${formatPrice(
        totalPrice
      )}`;
    });

    interiorContainer.appendChild(button);
  });
}


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

function calculateTotalPrice(config) {
  let totalPrice = config.price;
  const selectedExterior = config.exterior.find((ex) => ex.isSelected);
  if (selectedExterior) {
    totalPrice += selectedExterior.price;
  }
  const selectedWheel = config.wheels.find((w) => w.isSelected);
  if (selectedWheel) totalPrice += selectedWheel.price;
  const selectedInterior = config.interior.find((i) => i.isSelected);
  if (selectedInterior) totalPrice += selectedInterior.price || 0;
  return totalPrice;
}

// Sidebar and request sections visibility toggle
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

// Form submission logic with car data
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

      // Используем цену без блока "с учетом Trade-In"
      const selectedModelPrice =
        document.querySelector(".equipment.main_conf.selected .equipment__price span.tradein").textContent;

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

      // Отправляем данные модели без блока "Trade-In"
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
      dealer:formData.dealer,
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