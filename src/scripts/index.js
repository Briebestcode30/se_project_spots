import "core-js/stable";
import "regenerator-runtime/runtime";

import "./styles.css";

import likeBtn from "../images/like_btn.svg";
import likeActive from "../images/like_active.svg";
import deleteIcon from "../images/delete_icon.svg";
import deleteHover from "../images/delete_hover.svg";
import closeIcon from "../images/close_icon.svg";
import closeIconLight from "../images/close__icon-light.svg";
import logo from "../images/logo.png";

import { settings, enableValidation, resetValidation } from "./validation.js";
import Api from "./Api.js";

document.addEventListener("DOMContentLoaded", () => {
  const headerLogo = document.getElementById("header-logo");
  const profileAvatar = document.getElementById("profile-avatar");

  if (headerLogo) headerLogo.src = logo;
  if (profileAvatar) profileAvatar.src = logo;

  const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: "f9c36c82-4848-4bdf-9403-6c4b1fd1762a",
      "Content-Type": "application/json",
    },
  });

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
  const previewImage = previewModal?.querySelector(".modal__image");
  const previewCaption = previewModal?.querySelector(".modal__caption");
  const previewCloseBtn = previewModal?.querySelector(
    ".modal__close-btn_type_preview"
  );

  const deleteModal = document.querySelector("#delete-card-modal");
  const confirmDeleteBtn = document.querySelector("#confirm-delete-btn");

  const avatarModal = document.querySelector("#avatar-modal");
  const avatarForm = document.querySelector("#avatar-form");
  const avatarInput = document.querySelector("#avatar-url-input");

  const cardsContainer = document.querySelector(".cards__list");
  const cardTemplate = document.querySelector("#card-template");

  let cardToDelete = null;

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

  function createCardElement(data) {
    if (!cardTemplate) return null;
    const cardElement = cardTemplate.content
      .querySelector(".card")
      .cloneNode(true);

    const cardTitle = cardElement.querySelector(".card__title");
    const cardImage = cardElement.querySelector(".card__image");
    const likeBtnEl = cardElement.querySelector(".card__like-btn");
    const deleteBtn = cardElement.querySelector(".card__delete-button");

    if (cardTitle) cardTitle.textContent = data.name;
    if (cardImage) {
      cardImage.src = data.link;
      cardImage.alt = data.name;
      cardImage.addEventListener("click", () => openPreviewModal(data));
    }

    if (likeBtnEl) {
      likeBtnEl.addEventListener("click", () => {
        const isLiked = likeBtnEl.classList.contains("card__like-btn_active");
        const apiCall = isLiked
          ? api.removeLike(data._id)
          : api.addLike(data._id);
        apiCall
          .then((updatedCard) => {
            if (!likeBtnEl) return;
            likeBtnEl.classList.toggle("card__like-btn_active", !isLiked);
          })
          .catch(console.error);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        cardToDelete = { id: data._id, element: cardElement };
        openModal(deleteModal);
      });
    }

    return cardElement;
  }

  function openPreviewModal(data) {
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
        const cardEl = createCardElement(newCard);
        if (cardEl) cardsContainer.prepend(cardEl);
        newPostForm.reset();
        closeModal(newPostModal);
      })
      .catch(console.error)
      .finally(() => renderLoading(submitBtn, false, "Create"));
  });

  confirmDeleteBtn?.addEventListener("click", () => {
    if (!cardToDelete) return;
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

  profileAvatar?.addEventListener("click", () => {
    resetValidation(avatarForm, settings);
    openModal(avatarModal);
  });

  avatarForm?.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const submitBtn = avatarForm.querySelector(".modal__submit-btn");
    renderLoading(submitBtn, true, "Save");

    api
      .updateAvatar(avatarInput.value)
      .then((res) => {
        if (profileAvatar) profileAvatar.src = res.avatar;
        avatarForm.reset();
        closeModal(avatarModal);
      })
      .catch(console.error)
      .finally(() => renderLoading(submitBtn, false, "Save"));
  });

  Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, cards]) => {
      if (profileNameEl) profileNameEl.textContent = userData.name;
      if (profileDescEl) profileDescEl.textContent = userData.about;
      if (profileAvatar) profileAvatar.src = userData.avatar;

      cards.reverse().forEach((card) => {
        const cardEl = createCardElement(card);
        if (cardEl) cardsContainer.prepend(cardEl);
      });
    })
    .catch(console.error);

  enableValidation(settings);
});
