import axiosInstance from "./axiosInstance";

export const addToCartApi = async (courseId) => {
  const { data } = await axiosInstance.post("/cart", { courseId });
  return data;
};
