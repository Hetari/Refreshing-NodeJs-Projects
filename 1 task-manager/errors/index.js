class apiError extends Error {
  constructor(message, status) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

const createApiError = (message, status) => {
  return new apiError(message, status);
};

export { createApiError, apiError };
