export class ApiClient {
  constructor() {
    this.apiContext = global.apiContext;
  }

  async get(endpoint) {
    return this.apiContext.get(endpoint);
  }

  async post(endpoint, data) {
    return this.apiContext.post(endpoint, { data });
  }

  async put(endpoint, data, headers) {
    return this.apiContext.put(endpoint, { data: data, headers: headers });
  }

  async patch(endpoint, data, headers) {
    return this.apiContext.patch(endpoint, { data: data, headers: headers })
  }

  async delete(endpoint, headers) {
    return this.apiContext.delete(endpoint, { headers: headers });
  }
}