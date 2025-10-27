// tests/helper/testContext.js

class TestContext {
  constructor() {
    this.store = new Map();
  }

  set(key, value) {
    this.store.set(key, value);
  }

  get(key) {
    return this.store.get(key);
  }

  clear() {
    this.store.clear();
  }

  has(key) {
    return this.store.has(key);
  }
}

const testContext = new TestContext();

module.exports = { TestContext,testContext };
