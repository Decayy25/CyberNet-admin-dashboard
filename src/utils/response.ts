export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export const ResponseHandler = {
  success<T>(data: T, message = "Success"): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  },

  validation(errors: string[]): ApiResponse {
    return {
      success: false,
      message: "Validation failed",
      errors,
      data: undefined,
    };
  },

  error(message: string, errors?: string[]): ApiResponse {
    return {
      success: false,
      message,
      errors,
      data: undefined,
    };
  },
};
