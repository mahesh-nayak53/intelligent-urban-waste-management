import api from "../api/api";

export const loginUser = async (email, password) => {

  const response = await api.post(
    "/auth/login",
    {
      email,
      password
    }
  );

  return response.data;
};

export const registerCitizen = async (payload) => {
  await api.post("/auth/register", payload);
};

export const requestPasswordOtp = async (payload) => {
  await api.post("/auth/password/otp", payload);
};

export const resetPassword = async (payload) => {
  await api.post("/auth/password/reset", payload);
};