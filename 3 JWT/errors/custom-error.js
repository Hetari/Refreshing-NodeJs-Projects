class CustomErrorHandling extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { CustomErrorHandling };
