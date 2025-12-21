export function renderLoading(
  isLoading,
  button,
  buttonText = "Save",
  loadingText = "Saving..."
) {
  button.textContent = isLoading ? loadingText : buttonText;
}

export function handleSubmit(
  request,
  evt,
  loadingText = "Saving...",
  btn = ".modal__delete-btn"
) {
  evt.preventDefault();

  const submitButton = document.querySelector(btn);
  const initialText = "Deleting";

  renderLoading(true, submitButton, initialText, loadingText);

  request()
    .then(() => {})
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}
