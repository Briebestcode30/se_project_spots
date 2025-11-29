import "./index.css";
import { enableValidation, resetValidation } from "../scripts/validation.js";
import Api from "../scripts/Api.js";

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

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
const avatarEditButton = document.querySelector(".profile__avatar-edit-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = document.querySelector("#avatar-form");
const avatarInput = document.querySelector("#avatar-input");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = document.querySelector("#new-post-form");
const newPostImageInput = document.querySelector("#card-image-input");
const newPostCaptionInput = document.querySelector("#card-caption-input");

const previewModal = document.querySelector("#preview-image-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

const deleteConfirmModal = document.querySelector("#delete-confirm-modal");
const deleteConfirmForm = document.querySelector("#delete-confirm-form");

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
  btn.addEventListener("click", () => {
    closeModal(btn.closest(".modal"));
  });
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
  const likeButton = cardElement.querySelector(".card__like-btn");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardTitle.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;
  likeCount.textContent = data.likes.length;

  if (data.isLiked) {
    likeButton.classList.add("card__like-btn_active");
  }

  likeButton.addEventListener("click", () => {
    if (likeButton.classList.contains("card__like-btn_active")) {
      api
        .removeLike(data._id)
        .then((res) => {
          likeButton.classList.remove("card__like-btn_active");
          likeCount.textContent = res.likes.length;
        })
        .catch(console.error);
    } else {
      api
        .addLike(data._id)
        .then((res) => {
          likeButton.classList.add("card__like-btn_active");
          likeCount.textContent = res.likes.length;
        })
        .catch(console.error);
    }
  });

  deleteButton.addEventListener("click", () => {
    cardToDelete = { id: data._id, element: cardElement };
    openModal(deleteConfirmModal);
  });

  cardImage.addEventListener("click", () => openImagePreview(data));

  return cardElement;
}

deleteConfirmForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = deleteConfirmForm.querySelector(".modal__submit-btn");
  renderLoading(submitBtn, true, "Yes");

  api
    .deleteCard(cardToDelete.id)
    .then(() => {
      cardToDelete.element.remove();
      closeModal(deleteConfirmModal);
    })
    .catch(console.error)
    .finally(() => renderLoading(submitBtn, false, "Yes"));
});

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

avatarEditButton.addEventListener("click", () => {
  resetValidation(avatarForm, settings);
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = avatarForm.querySelector(".modal__submit-btn");

  renderLoading(submitBtn, true, "Save");

  api
    .updateAvatar(avatarInput.value)
    .then((res) => {
      profileAvatarEl.src = res.avatar;
      closeModal(avatarModal);
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
