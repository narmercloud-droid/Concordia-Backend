export const success = (res, data = null, message = "OK", status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    message
  });
};

export const fail = (res, code = "UNKNOWN_ERROR", message = "An error occurred", status = 400) => {
  return res.status(status).json({
    success: false,
    error: {
      code,
      message
    }
  });
};
