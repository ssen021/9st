export const loginSuccess = (userInfo) => ({
  type: "LOGIN_SUCCESS",
  userInfo,
});
export const loginRequest = () => ({
  type: "LOGIN_REQUEST",
});

export const loginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  error,
});
