import "./styles.css";
import { settings, enableValidation, resetValidation } from "./validation.js";
import Api from "./Api.js";

document.addEventListener("DOMContentLoaded", () => {
  const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: "f9c36c82-4848-4bdf-9403-6c4b1fd1762a",
      "Content-Type": "application/json",
    },
  });

  const editProfileBtn = document.querySelector(".profile__edit-btn");
  const editProfileModal = document.querySelector("#edit-profile-modal");
  const profileForm = document.querySelector("#profile-form");
  const profileNameInput = document.querySelector("#profile-name-input");
  const profileDescInput = document.querySelector("#profile-description-input");
  const profileNameEl = document.querySelector(".profile__name");
  const profileDescEl = document.querySelector(".profile__description");
  const profileAvatarEl = document.querySelector(".profile__avatar");

  const newPostBtn = document.querySelector(".profile__add-btn");
  const newPostModal = document.querySelector("#new-post-modal");
  const newPostForm = document.querySelector("#new-post-form");
  const newPostImageInput = document.querySelector("#card-image-input");
  const newPostCaptionInput = document.querySelector("#card-caption-input");

  const previewModal = document.querySelector("#preview-image-modal");
  const previewImage = previewModal.querySelector(".modal__image");
  const previewCaption = previewModal.querySelector(".modal__caption");

  const cardsContainer = document.querySelector(".cards__list");
  const cardTemplate = document.querySelector("#card-template");

  function openModal(modal) {
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", handleEscClose);
  }

  function closeModal(modal) {
    modal.classList.remove("modal_opened");
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
    button.textContent = isLoading ? "Saving..." : defaultText;
  }

  function getCardElement(data) {
    const cardElement = cardTemplate.content
      .querySelector(".card")
      .cloneNode(true);
    const cardTitle = cardElement.querySelector(".card__title");
    const cardImage = cardElement.querySelector(".card__image");

    cardTitle.textContent = data.name;
    cardImage.src = data.link;
    cardImage.alt = data.name;

    cardImage.addEventListener("click", () => openImagePreview(data));
    return cardElement;
  }

  function openImagePreview(data) {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  }

  editProfileBtn.addEventListener("click", () => {
    profileNameInput.value = profileNameEl.textContent;
    profileDescInput.value = profileDescEl.textContent;
    resetValidation(profileForm, settings);
    openModal(editProfileModal);
  });

  profileForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const submitBtn = profileForm.querySelector(".modal__submit-btn");
    renderLoading(submitBtn, true, "Save");

    api
      .updateProfile({
        name: profileNameInput.value,
        about: profileDescInput.value,
      })
      .then((res) => {
        profileNameEl.textContent = res.name;
        profileDescEl.textContent = res.about;
        closeModal(editProfileModal);
      })
      .catch(console.error)
      .finally(() => renderLoading(submitBtn, false, "Save"));
  });

  newPostBtn.addEventListener("click", () => {
    resetValidation(newPostForm, settings);
    openModal(newPostModal);
  });

  newPostForm.addEventListener("submit", (evt) => {
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
        cardsContainer.prepend(cardEl);
        newPostForm.reset();
        closeModal(newPostModal);
      })
      .catch(console.error)
      .finally(() => renderLoading(submitBtn, false, "Create"));
  });

  Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, cards]) => {
      profileNameEl.textContent = userData.name;
      profileDescEl.textContent = userData.about;
      profileAvatarEl.src = userData.avatar;

      cards.reverse().forEach((card) => {
        const cardEl = getCardElement(card);
        cardsContainer.prepend(cardEl);
      });
    })
    .catch(console.error);

  enableValidation(settings);
});
