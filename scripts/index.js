import "../pages/index.css";
import "./index.css";

import { enableValidation, resetValidation } from "../scripts/validation.js";

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Landscape reflection lake",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

  const editProfileBtn = document.querySelector(".profile__edit-btn");
  const editProfileModal = document.querySelector("#edit-profile-modal");
  const profileForm = document.querySelector("#profile-form");
  const profileNameInput = document.querySelector("#profile-name-input");
  const profileDescInput = document.querySelector("#profile-description-input");
  const profileNameEl = document.querySelector(".profile__name");
  const profileDescEl = document.querySelector(".profile__description");

  const newPostBtn = document.querySelector(".profile__add-btn");
  const newPostModal = document.querySelector("#new-post-modal");
  const newPostForm = document.querySelector("#new-post-form");
  const newPostImageInput = document.querySelector("#card-image-input");
  const newPostCaptionInput = document.querySelector("#card-caption-input");

  const previewModal = document.querySelector("#preview-image-modal");
  const previewImage = previewModal?.querySelector(".modal__image");
  const previewCaption = previewModal?.querySelector(".modal__caption");

  const cardsContainer = document.querySelector(".cards__list");
  const cardTemplate = document.querySelector("#card-template");

  function openModal(modal) {
    modal?.classList.add("modal_opened");
    document.addEventListener("keydown", handleEscClose);
  }

  function closeModal(modal) {
    modal?.classList.remove("modal_opened");
    document.removeEventListener("keydown", handleEscClose);
  }

  function handleEscClose(evt) {
    if (evt.key === "Escape") {
      const openModalEl = document.querySelector(".modal_opened");
      if (openModalEl) closeModal(openModalEl);
    }
  }

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("mousedown", (evt) => {
      if (evt.target === modal) closeModal(modal);
    });
  });

  document.querySelectorAll(".modal__close-btn").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
  });

  function renderLoading(button, isLoading, defaultText) {
    if (button) button.textContent = isLoading ? "Saving..." : defaultText;
  }

  function getCardElement(data) {
    if (!cardTemplate) return null;
    const cardElement = cardTemplate.content
      .querySelector(".card")
      .cloneNode(true);

    const cardTitle = cardElement.querySelector(".card__title");
    const cardImage = cardElement.querySelector(".card__image");

    if (cardTitle) cardTitle.textContent = data.name;
    if (cardImage) {
      cardImage.src = data.link;
      cardImage.alt = data.name;
      cardImage.addEventListener("click", () => openImagePreview(data));
    }

    return cardElement;
  }

  function openImagePreview(data) {
    if (previewImage) {
      previewImage.src = data.link;
      previewImage.alt = data.name;
    }
    if (previewCaption) previewCaption.textContent = data.name;
    openModal(previewModal);
  }

  editProfileBtn?.addEventListener("click", () => {
    if (
      profileNameInput &&
      profileDescInput &&
      profileNameEl &&
      profileDescEl
    ) {
      profileNameInput.value = profileNameEl.textContent;
      profileDescInput.value = profileDescEl.textContent;
    }
    resetValidation(profileForm, settings);
    openModal(editProfileModal);
  });

  profileForm?.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const submitBtn = profileForm.querySelector(".modal__submit-btn");
    renderLoading(submitBtn, true, "Save");

    api
      .updateProfile({
        name: profileNameInput.value,
        about: profileDescInput.value,
      })
      .then((res) => {
        if (profileNameEl) profileNameEl.textContent = res.name;
        if (profileDescEl) profileDescEl.textContent = res.about;
        closeModal(editProfileModal);
      })
      .catch(console.error)
      .finally(() => renderLoading(submitBtn, false, "Save"));
  });

  newPostBtn?.addEventListener("click", () => {
    resetValidation(newPostForm, settings);
    openModal(newPostModal);
  });

  newPostForm?.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const submitBtn = newPostForm.querySelector(".modal__submit-btn");
    renderLoading(submitBtn, true, "Create");

    api
      .addCard({
        name: newPostCaptionInput.value,
        link: newPostImageInput.value,
      })
      .then((newCard) => {
        const cardEl = getCardElement(newCard);
        if (cardEl) cardsContainer.prepend(cardEl);
        newPostForm.reset();
        closeModal(newPostModal);
      })
      .catch(console.error)
      .finally(() => renderLoading(submitBtn, false, "Create"));
  });

  Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, cards]) => {
      if (profileNameEl) profileNameEl.textContent = userData.name;
      if (profileDescEl) profileDescEl.textContent = userData.about;
      if (profileAvatar) profileAvatar.src = userData.avatar;

      cards.reverse().forEach((card) => {
        const cardEl = getCardElement(card);
        if (cardEl) cardsContainer.prepend(cardEl);
      });
    })
    .catch(console.error);

  enableValidation(settings);
});
