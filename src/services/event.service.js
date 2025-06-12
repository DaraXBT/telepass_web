import ihttp, {ihttpFormData} from "@/api/interceptor";

export const getAllEvents = async () => {
  try {
    const response = await ihttp.get(`/api/v1/events`);
    return response;
  } catch (error) {
    console.error("Error in getAllEvents:", error);

    // If it's an authentication error, return empty data instead of crashing
    if (
      error.code === "UNAUTHENTICATED" ||
      error.code === "TOKEN_EXPIRED" ||
      error.message === "missing access token" ||
      error.message === "missing access token in session" ||
      error.message === "JWT token expired"
    ) {
      console.warn(
        "Authentication issue - user may need to log in again:",
        error.message
      );
      return {data: []}; // Return empty events array
    }

    // For 500 errors, log the response data to understand the backend error
    if (error.response && error.response.status === 500) {
      console.error("Backend 500 error details:", error.response.data);
      console.error("Backend error headers:", error.response.headers);
    }

    // For other errors, log detailed info
    console.error("Error status:", error.status);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response);
    return {data: []}; // Return empty array instead of error to prevent crashes
  }
};

export const getEvent = async (eventId) => {
  try {
    const response = await ihttp.get(`/api/v1/events/${eventId}`);
    return response.data; // Assuming your API returns the event data directly
  } catch (error) {
    throw error;
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
    console.log("Attempting to delete event with ID:", eventId);
    // Delete event in backend
    const response = await ihttp.delete(`/api/v1/events/${eventId}`);
    console.log("Delete event response:", response);
    return response;
  } catch (error) {
    console.error("Error in deleteEvent:", error);

    // Log detailed error information for debugging
    if (error.response) {
      console.error(
        "Delete event - Backend error status:",
        error.response.status
      );
      console.error("Delete event - Backend error data:", error.response.data);
      console.error(
        "Delete event - Backend error headers:",
        error.response.headers
      );
    } else if (error.request) {
      console.error("Delete event - No response received:", error.request);
    } else {
      console.error("Delete event - Request setup error:", error.message);
    }

    throw error;
  }
};
