class CustomErrorHandling extends Error {
  constructor(msg, statusCode) {
    super(msg);
    this.statusCode = statusCode;
  }
}

export { CustomErrorHandling };
