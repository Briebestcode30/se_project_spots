export default class Api {
  constructor({ headers }) {
    this._headers = headers;

    this._user = {
      _id: "user-123",
      name: "Jane Doe",
      about: "Web Developer",
      avatar: "https://i.pravatar.cc/150?img=3",
    };

    this._cards = [
      {
        _id: "card-1",
        name: "Beautiful Landscape",
        link: "https://picsum.photos/id/1015/300/200",
        likes: [],
      },
      {
        _id: "card-2",
        name: "City at Night",
        link: "https://picsum.photos/id/1011/300/200",
        likes: [],
      },
    ];
  }

  _simulate(data) {
    return new Promise((resolve) => setTimeout(() => resolve(data), 300));
  }

  getUserInfo() {
    return this._simulate(this._user);
  }

  updateProfile({ name, about }) {
    this._user.name = name;
    this._user.about = about;
    return this._simulate(this._user);
  }

  updateAvatar(avatar) {
    this._user.avatar = avatar;
    return this._simulate(this._user);
  }

  getInitialCards() {
    return this._simulate(this._cards);
  }

  addCard({ name, link }) {
    const card = {
      _id: `card-${Date.now()}`,
      name,
      link,
      likes: [],
    };
    this._cards.unshift(card);
    return this._simulate(card);
  }

  deleteCard(cardId) {
    this._cards = this._cards.filter((c) => c._id !== cardId);
    return this._simulate({});
  }

  addLike(cardId) {
    const card = this._cards.find((c) => c._id === cardId);
    if (card && !card.likes.includes(this._user._id)) {
      card.likes.push(this._user._id);
    }
    return this._simulate(card);
  }

  removeLike(cardId) {
    const card = this._cards.find((c) => c._id === cardId);
    if (card) {
      card.likes = card.likes.filter((id) => id !== this._user._id);
    }
    return this._simulate(card);
  }
}
