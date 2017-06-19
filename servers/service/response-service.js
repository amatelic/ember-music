class Response {
  constructor() { }

  ok(data) {
    return {
      data, status: 200
    };
  }

  _404(message) {
    return this.error(message, 404);
  }

  error(message, status) {
    return {
      message, status
    };
  }
}

module.exports = new Response();
