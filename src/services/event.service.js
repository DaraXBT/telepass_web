import ihttp, {ihttpFormData} from "@/api/interceptor";

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
      {responseType: "blob"}
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add an event to the system
 */
export const addEvent = async (event) => {
  try {
    // Add event to backend
    const response = await ihttp.post(`/api/v1/events`, event);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an event in the system
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    // Update event in backend
    const response = await ihttp.put(`/api/v1/events/${eventId}`, eventData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an event from the system
 */
export const deleteEvent = async (eventId) => {
  try {
    // Delete event in backend
    const response = await ihttp.delete(`/api/v1/events/${eventId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
