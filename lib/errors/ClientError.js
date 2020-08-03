class ClientError extends Error {
  constructor(message, ...params) {
    super(params);
    if (Error.captureStackTrace) { // Maintains proper stack trace for where our error was thrown
      Error.captureStackTrace(this, ClientError);
    }

    this.message = message;
  }
}

module.exports = {
  ClientError
}