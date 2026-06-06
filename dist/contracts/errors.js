export var ApiErrorCode;
(function (ApiErrorCode) {
    ApiErrorCode["INVALID_INPUT"] = "INVALID_INPUT";
    ApiErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ApiErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ApiErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ApiErrorCode["CONFLICT"] = "CONFLICT";
    ApiErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ApiErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
})(ApiErrorCode || (ApiErrorCode = {}));
export const DEFAULT_INTERNAL_ERROR_MESSAGE = 'An internal error occurred';
