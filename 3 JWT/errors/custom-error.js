class CustomErrorHandling extends Error {
  constructor(msg, statusCode) {
    super(msg);
  }
}

export { CustomErrorHandling };
