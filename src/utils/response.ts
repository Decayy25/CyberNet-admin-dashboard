export const ResponseHandler = {
  success<T>(data: T, message = "Success") {
    return {
      success: true,
      message,
      data,
    };
  },

  validation(errors: string[]) {
    return {
      success: false,
      message: "Validation failed",
      errors,
    };
  },

  error(message: string) {
    return {
      success: false,
      message,
    };
  },
};
