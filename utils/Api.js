class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _request(endpoint, options) {
    return fetch(`${this._baseUrl}${endpoint}`, {
      headers: this._headers,
      ...options,
    }).then((res) =>
      res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
    );
  }

  getUser() {
    return this._request("/users/me", {
      method: "GET",
    });
  }

  updateUser({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  getInitialCards() {
    return this._request("/cards", {
      method: "GET",
    });
  }

  addCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: "DELETE",
    });
  }

  likeCard(cardId) {
    return this._request(`/cards/likes/${cardId}`, {
      method: "PUT",
    });
  }

  unlikeCard(cardId) {
    return this._request(`/cards/likes/${cardId}`, {
      method: "DELETE",
    });
  }
}

export default Api;
