export function httpStatusFromCode(code: string): number {
  switch (code) {
    case "NOT_FOUND":
      return 404;
    case "UNAUTHORIZED":
    case "INVALID_CREDENTIALS":
    case "INVALID_TOKEN":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "CONFLICT":
      return 409;
    case "INVALID_INPUT":
    case "VALIDATION_ERROR":
    case "BAD_REQUEST":
    case "INVALID_OPERATION":
      return 400;
    case "NOT_IMPLEMENTED":
      return 501;
    case "INTERNAL_ERROR":
    default:
      return 500;
  }
}
