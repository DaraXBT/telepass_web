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

export const getEventsByAdminId = async (adminId) => {
  try {
    const response = await ihttp.get(`/api/v1/events/admin/${adminId}`);
    return response;
  } catch (error) {
    console.error("Error in getEventsByAdminId:", error);

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
    // Clean and validate the payload before sending
    const cleanedEvent = {
      name: String(event.name || "").trim(),
      description: String(event.description || "").trim(),
      status: String(event.status || "").trim(),
      category: String(event.category || "").trim(),
      capacity: parseInt(event.capacity) || 0,
      registered: parseInt(event.registered) || 1,
      qrCodePath: String(event.qrCodePath || ""),
      eventImg: String(event.eventImg || ""),
      adminId: String(event.adminId || ""),
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      location: String(event.location || "").trim(),
      isFree: Boolean(event.isFree),
      ticketPrice: event.isFree ? 0 : parseFloat(event.ticketPrice) || 0,
      currency: String(event.currency || "KHR"),
      // Fix: Convert "on" string to boolean
      paymentRequired: event.paymentRequired === "on" || event.paymentRequired === true || event.paymentRequired === "true",
      eventRoles: Array.isArray(event.eventRoles) ? event.eventRoles.map(role => ({
        userId: String(role.userId),
        role: String(role.role)
      })) : [],
      registeredUsers: Array.isArray(event.registeredUsers) ? event.registeredUsers : []
    };

    console.log("=== CLEANED EVENT PAYLOAD ===");
    console.log(JSON.stringify(cleanedEvent, null, 2));

    // Add event to backend
    const response = await ihttp.post(`/api/v1/events`, cleanedEvent);
    return response;
  } catch (error) {
    console.error("=== ADD EVENT ERROR ===");
    console.error("Error status:", error?.response?.status);
    console.error("Error message:", error?.message);
    console.error("Backend error data:", error?.response?.data);
    console.error("Full error response:", error?.response);
    throw error;
  }
};

/**
 * Update an event in the system
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    // Clean and validate the payload before sending
    const cleanedEvent = {
      name: String(eventData.name || "").trim(),
      description: String(eventData.description || "").trim(),
      status: String(eventData.status || "").trim(),
      category: String(eventData.category || "").trim(),
      capacity: parseInt(eventData.capacity) || 0,
      registered: parseInt(eventData.registered) || 1,
      qrCodePath: String(eventData.qrCodePath || ""),
      eventImg: String(eventData.eventImg || ""),
      adminId: String(eventData.adminId || ""),
      startDateTime: eventData.startDateTime,
      endDateTime: eventData.endDateTime,
      location: String(eventData.location || "").trim(),
      isFree: Boolean(eventData.isFree),
      ticketPrice: eventData.isFree ? 0 : parseFloat(eventData.ticketPrice) || 0,
      currency: String(eventData.currency || "KHR"),
      // Fix: Convert "on" string to boolean
      paymentRequired: eventData.paymentRequired === "on" || eventData.paymentRequired === true || eventData.paymentRequired === "true",
      eventRoles: Array.isArray(eventData.eventRoles) ? eventData.eventRoles.map(role => ({
        userId: String(role.userId),
        role: String(role.role)
      })) : [],
      registeredUsers: Array.isArray(eventData.registeredUsers) ? eventData.registeredUsers : []
    };

    console.log("=== CLEANED UPDATE PAYLOAD ===");
    console.log(JSON.stringify(cleanedEvent, null, 2));

    // Update event in backend
    const response = await ihttp.put(`/api/v1/events/${eventId}`, cleanedEvent);
    return response;
  } catch (error) {
    console.error("=== UPDATE EVENT ERROR ===");
    console.error("Error status:", error?.response?.status);
    console.error("Error message:", error?.message);
    console.error("Backend error data:", error?.response?.data);
    console.error("Full error response:", error?.response);
    throw error;
  }
};

/**
 * Get audiences for a specific event
 */
export const getEventAudiences = async (eventId) => {
  try {
    const response = await ihttp.get(`/api/v1/audiences/event/${eventId}`);
    return response.data; // Return the array of audience members directly
  } catch (error) {
    console.error("Error in getEventAudiences:", error);

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
      return []; // Return empty audiences array
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
    return []; // Return empty array instead of error to prevent crashes
  }
};

/**
 * Get QR code image for audience member
 */
export const getAudienceQrCode = async (fileName) => {
  try {
    const response = await ihttp.get(
      `/api/v1/audiences/qrcode?fileName=${fileName}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getAudienceQrCode:", error);
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

/**
 * Get event roles/organizers for a specific event
 */
export const getEventRoles = async (eventId) => {
  try {
    const response = await ihttp.get(`/api/v1/events/${eventId}/roles`);
    return response.data;
  } catch (error) {
    console.error("Error in getEventRoles:", error);

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
      return [];
    }

    // For other errors, log detailed info
    console.error("Error status:", error.status);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response);
    return [];
  }
};
