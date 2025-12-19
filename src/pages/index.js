import "./index.css";
import logo from "../images/logo.png";
import avatar from "../images/avatar.png";

import { enableValidation, resetValidation } from "./validation.js";
import { validationSettings } from "../utils/constants.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "4948c3b5-5bde-4e7c-a9ca-627337b4c1e5",
    "Content-Type": "application/json",
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const headerLogo = document.querySelector("#header-logo");
  const profileAvatar = document.querySelector("#profile-avatar");

  if (headerLogo) headerLogo.src = logo;
  if (profileAvatar) profileAvatar.src = avatar;

  const editProfileBtn = document.querySelector(".profile__edit-btn");
  const editProfileModal = document.querySelector("#edit-profile-modal");
  const profileForm = document.querySelector("#edit-profile-form");
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
  const previewImage = previewModal.querySelector(".modal__image");
  const previewCaption = previewModal.querySelector(".modal__caption");

  const deleteModal = document.querySelector("#delete-card-modal");
  const confirmDeleteBtn = document.querySelector("#confirm-delete-btn");

  const avatarModal = document.querySelector("#avatar-modal");
  const avatarForm = document.querySelector("#avatar-form");
  const avatarInput = document.querySelector("#avatar-url-input");

  const cardsContainer = document.querySelector(".cards__list");
  const cardTemplate = document.querySelector("#card-template");

  let cardToDelete = null;

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
      const openedModal = document.querySelector(".modal_opened");
      if (openedModal) closeModal(openedModal);
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

  function openPreviewModal(data) {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  }

  function createCardElement(data) {
    const cardElement = cardTemplate.content
      .querySelector(".card")
      .cloneNode(true);

    const cardTitle = cardElement.querySelector(".card__title");
    const cardImage = cardElement.querySelector(".card__image");
    const likeBtnEl = cardElement.querySelector(".card__like-btn");
    const deleteBtn = cardElement.querySelector(".card__delete-button");

    cardTitle.textContent = data.name;
    cardImage.src = data.link;
    cardImage.alt = data.name;

    cardImage.addEventListener("click", () => openPreviewModal(data));

    likeBtnEl.addEventListener("click", () => {
      const isLiked = likeBtnEl.classList.contains("card__like-btn_active");
      const request = isLiked
        ? api.unlikeCard(data._id)
        : api.likeCard(data._id);

      request
        .then(() => likeBtnEl.classList.toggle("card__like-btn_active"))
        .catch(console.error);
    });

    deleteBtn.addEventListener("click", () => {
      cardToDelete = { id: data._id, element: cardElement };
      openModal(deleteModal);
    });

    if (data.likes && data.likes.some((u) => u._id === api._user?._id)) {
      likeBtnEl.classList.add("card__like-btn_active");
    }

    return cardElement;
  }

  editProfileBtn.addEventListener("click", () => {
    profileNameInput.value = profileNameEl.textContent;
    profileDescInput.value = profileDescEl.textContent;
    resetValidation(profileForm, validationSettings);
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
    resetValidation(newPostForm, validationSettings);
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
      .then((card) => {
        cardsContainer.prepend(createCardElement(card));
        newPostForm.reset();
        closeModal(newPostModal);
      })
      .catch(console.error)
      .finally(() => renderLoading(submitBtn, false, "Create"));
  });

  confirmDeleteBtn.addEventListener("click", () => {
    renderLoading(confirmDeleteBtn, true, "Deleting...");
    api
      .deleteCard(cardToDelete.id)
      .then(() => {
        cardToDelete.element.remove();
        cardToDelete = null;
        closeModal(deleteModal);
      })
      .catch(console.error)
      .finally(() => renderLoading(confirmDeleteBtn, false, "Delete"));
  });

  if (profileAvatar) {
    profileAvatar.addEventListener("click", () => {
      resetValidation(avatarForm, validationSettings);
      openModal(avatarModal);
    });

    avatarForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const submitBtn = avatarForm.querySelector(".modal__submit-btn");
      renderLoading(submitBtn, true, "Save");

      api
        .updateAvatar({ avatar: avatarInput.value })
        .then((res) => {
          profileAvatar.src = res.avatar;
          avatarForm.reset();
          closeModal(avatarModal);
        })
        .catch(console.error)
        .finally(() => renderLoading(submitBtn, false, "Save"));
    });
  }

  Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, cards]) => {
      profileNameEl.textContent = userData.name;
      profileDescEl.textContent = userData.about;
      profileAvatar.src = userData.avatar;

      cards.reverse().forEach((card) => {
        cardsContainer.prepend(createCardElement(card));
      });
    })
    .catch(console.error);

  enableValidation(validationSettings);
});
