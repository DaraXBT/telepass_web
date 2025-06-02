import { ihttpFormData } from "@/api/inteceptor";

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await ihttpFormData.post("/api/v1/images/file", formData);
  return response.data.payload; // fileName
};

export const getProfileImageUrl = (fileName) =>
  `/api/v1/images/getImage?fileName=${encodeURIComponent(fileName)}`;
