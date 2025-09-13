import { create } from "zustand";
import authApi from "../services/authApi";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await authApi.login(email, password);
      const token = await userCredential.user.getIdToken();

      let backendProfile = null;
      try {
        // We need to add getUserByFirebaseUid to authApi
        backendProfile = await authApi.getUserByFirebaseUid(
          userCredential.user.uid,
          token
        );
      } catch (profileError) {
        console.warn("Could not fetch backend profile:", profileError);
      }

      const user = {
        // Backend data
        id: backendProfile?.id || null,
        first_name: backendProfile?.first_name || null,
        last_name: backendProfile?.last_name || null,
        phone_number: backendProfile?.phone_number || null,
        role: backendProfile?.role || "customer",

        // Firebase data
        name:
          userCredential.user.displayName ||
          `${backendProfile?.first_name} ${backendProfile?.last_name}`,
        phoneNumber:
          userCredential.user.phoneNumber || backendProfile?.phone_number,
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        token,
      };

      set({
        user,
        isAuthenticated: true,
        loading: false,
      });

      return user;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      // 🔥 Use your existing authApi.register method
      const backendUser = await authApi.register(userData);

      // Then login with Firebase to get token
      const userCredential = await authApi.login(
        userData.email,
        userData.password
      );
      const token = await userCredential.user.getIdToken();

      // 🔥 Try to get complete profile from backend
      let completeProfile = null;
      try {
        completeProfile = await authApi.getUserByFirebaseUid(
          userCredential.user.uid,
          token
        );
      } catch (profileError) {
        console.warn(
          "Could not fetch complete profile, using registration data:",
          profileError
        );
        completeProfile = backendUser;
      }

      const user = {
        // Backend data
        id: completeProfile?.id || backendUser?.id,
        first_name: completeProfile?.first_name || userData.first_name,
        last_name: completeProfile?.last_name || userData.last_name,
        phone_number: completeProfile?.phone_number || userData.phone_number,
        role: completeProfile?.role || backendUser?.role || "customer",

        // Firebase data
        name:
          userCredential.user.displayName ||
          `${userData.first_name} ${userData.last_name}`,
        phoneNumber: userCredential.user.phoneNumber || userData.phone_number,
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        token,

        // Include any other backend fields
        ...completeProfile,
      };

      set({
        user,
        isAuthenticated: true,
        loading: false,
      });

      return user;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Clear state even if logout fails
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  initAuth: () => {
    const unsubscribe = authApi.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();

          // 🔥 Try to get backend profile
          let backendProfile = null;
          try {
            backendProfile = await authApi.getUserByFirebaseUid(
              firebaseUser.uid,
              token
            );
          } catch (profileError) {
            console.warn(
              "Could not fetch backend profile during init:",
              profileError
            );
          }

          const user = {
            // Backend data
            id: backendProfile?.id || null,
            first_name: backendProfile?.first_name || null,
            last_name: backendProfile?.last_name || null,
            phone_number: backendProfile?.phone_number || null,
            role: backendProfile?.role || "customer",

            // Firebase data
            name:
              firebaseUser.displayName ||
              `${backendProfile?.first_name} ${backendProfile?.last_name}`,
            phoneNumber:
              firebaseUser.phoneNumber || backendProfile?.phone_number,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            token,

            // Include any other backend fields
            ...backendProfile,
          };

          set({
            user,
            isAuthenticated: true,
            loading: false,
          });
        } catch (tokenError) {
          console.error("Failed to get user token during init:", tokenError);
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: "Authentication failed",
          });
        }
      } else {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    });

    return unsubscribe;
  },

  refreshProfile: async () => {
    const currentUser = get().user;
    if (!currentUser || !currentUser.uid) {
      throw new Error("No authenticated user to refresh");
    }

    try {
      const token = await authApi.getCurrentUserToken();
      const backendProfile = await authApi.getUserByFirebaseUid(
        currentUser.uid,
        token
      );

      const updatedUser = {
        ...currentUser,
        ...backendProfile,
        token, // Update token as well
      };

      set({
        user: updatedUser,
      });

      return updatedUser;
    } catch (error) {
      console.error("Failed to refresh profile:", error);
      throw error;
    }
  },

  updateProfile: async (updateData) => {
    const currentUser = get().user;
    if (!currentUser || !currentUser.id) {
      throw new Error("No authenticated user to update");
    }

    try {
      const token = await authApi.getCurrentUserToken();
      const updatedProfile = await authApi.updateUser(
        currentUser.id,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = {
        ...currentUser,
        ...updatedProfile,
      };

      set({
        user: updatedUser,
      });

      return updatedUser;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
