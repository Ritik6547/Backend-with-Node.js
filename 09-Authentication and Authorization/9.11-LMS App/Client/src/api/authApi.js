import axiosInstance from "./axiosInstance";

export const registerApi = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data;
};

export const loginApi = async (userData) => {
  const { data } = await axiosInstance.post("/auth/login", userData);
  return data;
};

export const userProfileApi = async () => {
  const { data } = await axiosInstance.get("/auth/profile");
  return data;
};

export const logoutApi = async () => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};
