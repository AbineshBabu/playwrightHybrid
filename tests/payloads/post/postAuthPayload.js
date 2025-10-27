exports.PostAuthPayload = class PostAuthPayload {
  constructor() {
    // Default values (optional)
    this._username = "admin";
    this._password = "password123";

    // Response field (optional — to store the token after request)
    this._token = null;
  }

  // ====== Setters ======
  setUsername(username) {
    this._username = username;
    return this;
  }

  setPassword(password) {
    this._password = password;
    return this;
  }

  setToken(token) {
    this._token = token;
    return this;
  }

  // ====== Getters ======
  getUsername() {
    return this._username;
  }

  getPassword() {
    return this._password;
  }

  getToken() {
    return this._token;
  }

  // ====== Build final request body ======
  build() {
    return {
      username: this._username,
      password: this._password
    };
  }


}