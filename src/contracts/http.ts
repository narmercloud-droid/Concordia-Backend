export type ApiError = {
  code: string;
  message: string;
  details?: any;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: ApiError;
};

export function successResponse<T = any>(data?: T): ApiResponse<T> {
  return { success: true, data };
}

export function errorResponse(code: string, message: string, details?: any): ApiResponse {
  return { success: false, error: { code, message, details } };
}

export function isApiError(e: any): e is ApiError {
  return e && typeof e === 'object' && typeof e.code === 'string' && typeof e.message === 'string';
}

// explicit exports for clarity
// explicit re-exports removed — types are exported above via `export type`
