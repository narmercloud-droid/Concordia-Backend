export function httpStatusFromCode(code) {
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
        case "INVALID_POSTAL_CODE":
            return 400;
        case "PAYMENT_FAILED":
            return 402;
        case "SERVICE_UNAVAILABLE":
            return 503;
        case "NOT_IMPLEMENTED":
            return 501;
        case "INTERNAL_ERROR":
        default:
            return 500;
    }
}
