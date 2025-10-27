import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { api } from "@/services/api";
import { auth } from "../firebase/config";

/**
 * 🔐 AUTH API SERVICE
 * Centralized authentication calls using your exact backend routes
 * Registration: /api/users/user (no auth required)
 * Profile: /api/users/{id} (with Firebase token)
 * Admin creation: /api/users/admin (requires auth)
 */
const authApi = {
  /**
   * 📝 REGISTER NEW USER
   * Creates new user account via your /api/users/user endpoint
   * Returns user data with role for routing decisions
   * Example: const user = await authApi.register({first_name: "John", ...});
   */
  register: async (userData, options = {}) => {
    // Input validation
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "password",
    ];
    const missingFields = requiredFields.filter((field) => !userData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    try {
      return await api.post("/users/user", userData, {
        ...options,
      });
    } catch (error) {
      console.error("Failed to register user:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 👨‍💼 CREATE ADMIN USER
   * Creates admin user via your /api/users/admin endpoint
   * Requires Firebase authentication token
   * Example: const admin = await authApi.createAdmin(userData, token);
   */
  createAdmin: async (userData, firebaseToken, options = {}) => {
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "password",
    ];
    const missingFields = requiredFields.filter((field) => !userData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    if (!firebaseToken) {
      throw new Error("Firebase token is required for admin creation");
    }

    try {
      return await api.post("/users/admin", userData, {
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
        },
        ...options,
      });
    } catch (error) {
      console.error("Failed to create admin user:", error.details);
      throw error;
    }
  },

  /**
   * 🔑 LOGIN WITH FIREBASE
   * Authenticates user via Firebase Auth
   * Returns Firebase user credentials for token generation
   * Example: const userCredential = await authApi.login("email", "password");
   */
  login: async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.error("Firebase login failed:", {
        code: error.code,
        message: error.message,
      });
      throw error;
    }
  },

  /**
   * 🔥 GET USER BY FIREBASE UID
   * Fetches user profile data using Firebase UID from your /api/users/uid/{uid} endpoint
   * Perfect for getting backend user data after Firebase authentication
   * Includes user addresses and complete profile information
   * Example: const profile = await authApi.getUserByUid("Yl3a2XETvSVW1JI6XEW7ZZrxJwA2", token);
   */
  getUserByUid: async (firebaseUid, options = {}) => {
    if (!firebaseUid) {
      throw new Error("Firebase UID is required");
    }

    try {
      return await api.get(`/users/uid/${firebaseUid}`, {
        ...options,
      });
    } catch (error) {
      console.error(`Failed to fetch user by Firebase UID ${firebaseUid}:`, {
        uid: firebaseUid,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 👤 GET USER BY ID
   * Fetches user profile data from your /api/users/{id} endpoint
   * Uses the user ID to get profile information
   * Example: const profile = await authApi.getUserById(123);
   */
  getUserById: async (userId, options = {}) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      return await api.get(`/users/${userId}`, options);
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error.details);
      throw error;
    }
  },

  /**
   * 📋 GET ALL USERS
   * Fetches all users from your /api/users endpoint
   * Useful for admin dashboards and user management
   * Example: const users = await authApi.getAllUsers();
   */
  getAllUsers: async (options = {}) => {
    try {
      return await api.get("/users", options);
    } catch (error) {
      console.error("Failed to fetch all users:", error.details);
      throw error;
    }
  },

  /**
   * ✏️ UPDATE USER
   * Updates user information via your /api/users/{id} endpoint
   * Example: const updatedUser = await authApi.updateUser(123, {first_name: "John"});
   */
  updateUser: async (userId, updateData, options = {}) => {
    if (!userId) {
      throw new Error("User ID is required for updates");
    }

    try {
      return await api.put(`/users/${userId}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update user ${userId}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE USER
   * Deletes user via your /api/users/{id} endpoint
   * WARNING: This action cannot be undone!
   * Example: await authApi.deleteUser(123);
   */
  deleteUser: async (userId, options = {}) => {
    if (!userId) {
      throw new Error("User ID is required for deletion");
    }

    try {
      return await api.delete(`/users/${userId}`, options);
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },

  /**
   * 🚪 LOGOUT USER
   * Signs out user from Firebase Auth
   * Clears all authentication tokens and sessions
   * Example: await authApi.logout();
   */
  logout: async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Failed to logout:", {
        code: error.code,
        message: error.message,
      });
      throw error;
    }
  },

  /**
   * 👁️ AUTH STATE LISTENER
   * Monitors Firebase authentication state changes
   * Returns unsubscribe function to stop listening
   * Example: const unsubscribe = authApi.onAuthStateChanged((user) => {...});
   */
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * 🎫 GET CURRENT USER TOKEN
   * Gets fresh Firebase ID token for API calls
   * Automatically refreshes if token is expired
   * Example: const token = await authApi.getCurrentUserToken();
   */
  getCurrentUserToken: async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    try {
      return await currentUser.getIdToken();
    } catch (error) {
      console.error("Failed to get user token:", error);
      throw error;
    }
  },
};

export default authApi;
