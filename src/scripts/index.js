import "../pages/index.css";
import "./index.css";

import { enableValidation, resetValidation } from "../scripts/validation.js";

<<<<<<< HEAD:scripts/index.js
const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};
=======
import likeBtn from "../images/like_btn.svg";
import likeActive from "../images/like_active.svg";
import deleteIcon from "../images/delete_icon.svg";
import deleteHover from "../images/delete_hover.svg";
import closeIcon from "../images/close_icon.svg";
import closeIconLight from "../images/close__icon-light.svg";
import logo from "../images/logo.png";
>>>>>>> 6759f45 (project changes):src/scripts/index.js

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
