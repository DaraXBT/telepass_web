import ihttp, { ihttpFormData } from "@/api/inteceptor";

export const getAllEvents = async () => {
  try {
    const response = await ihttp.get(`/api/v1/events`);
    return response;
  } catch (error) {
    return error;
  }
};

export const fetchEventQrCode = async (eventId) => {
  try {
    const response = await ihttpFormData.get(
      `/api/v1/events/${eventId}/qrcode`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addEvent = async (event) => {
  try {
    const response = await ihttp.post(`/api/v1/events`, event);
    return response;
  } catch (error) {
    throw error;
  }
};
