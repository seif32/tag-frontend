import { API_BASE_URL } from "@/constants";

// Get auth token (Firebase will be added here later)
const getAuthToken = () => {
  // For now, return null - we'll add Firebase auth later
  return null;

  // Future Firebase implementation will look like:
  // import { getAuth } from 'firebase/auth'
  // const auth = getAuth()
  // return auth.currentUser ? await auth.currentUser.getIdToken() : null
};

// Main reusable fetch function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const startTime = Date.now();

  try {
    const token = await getAuthToken();

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add auth header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    // 🔍 Log request details in development
    if (process.env.NODE_ENV === "development") {
      console.group(`🚀 API Request: ${config.method || "GET"} ${url}`);
      console.log("Headers:", headers);
      if (config.body) {
        console.log("Body:", config.body);
      }
      console.groupEnd();
    }

    const response = await fetch(url, config);
    const responseTime = Date.now() - startTime;

    // 🔍 Log response details in development
    if (process.env.NODE_ENV === "development") {
      console.group(`📡 API Response: ${response.status} (${responseTime}ms)`);
      console.log("Status:", response.status, response.statusText);
      console.log("Headers:", Object.fromEntries(response.headers.entries()));
      console.groupEnd();
    }

    // Handle different response types
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `API Error: ${response.status}`;
      let errorDetails = null;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorDetails = errorData;
      } catch {
        // If can't parse JSON, use status text
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      // 🔍 Enhanced error logging
      console.group(`❌ API Error: ${config.method || "GET"} ${url}`);
      console.error("Status:", response.status);
      console.error("Status Text:", response.statusText);
      console.error("Error Message:", errorMessage);
      if (errorDetails) {
        console.error("Error Details:", errorDetails);
      }
      console.error("Request Config:", config);
      console.error("Response Time:", responseTime + "ms");
      console.groupEnd();

      // Create enhanced error object
      const error = new Error(errorMessage);
      error.status = response.status;
      error.statusText = response.statusText;
      error.details = errorDetails;
      error.url = url;
      error.method = config.method || "GET";
      error.responseTime = responseTime;

      throw error;
    }

    // Handle empty responses (like DELETE requests)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      // 🔍 Log successful response data in development
      if (process.env.NODE_ENV === "development") {
        console.log(`✅ API Success: ${config.method || "GET"} ${url}`, data);
      }

      return data;
    }

    return response;
  } catch (error) {
    // 🔍 Enhanced network error logging
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.group(`🌐 Network Error: ${options.method || "GET"} ${url}`);
      console.error("Network Error:", error.message);
      console.error("Possible causes:");
      console.error("- Server is down");
      console.error("- CORS issues");
      console.error("- Network connectivity problems");
      console.error("- Invalid URL");
      console.groupEnd();

      throw new Error(
        `Network request failed: Check your internet connection or server status`
      );
    }

    // 🔍 Auth token errors
    if (error.message.includes("getAuthToken")) {
      console.group(`🔐 Auth Token Error: ${options.method || "GET"} ${url}`);
      console.error("Auth Error:", error.message);
      console.error("Possible causes:");
      console.error("- Firebase auth not initialized");
      console.error("- User not logged in");
      console.error("- Token expired");
      console.groupEnd();

      throw new Error(`Authentication failed: ${error.message}`);
    }

    // Re-throw with better error context
    console.error(
      `💥 Unexpected API Error: ${options.method || "GET"} ${url}`,
      error
    );
    throw error;
  }
}

// Convenience methods for different HTTP verbs
export const api = {
  get: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: "GET" }),

  post: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: "DELETE" }),
};
