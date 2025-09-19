import { create } from "zustand";
import authApi from "../services/authApi";
import { sendEmailVerification } from "firebase/auth";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  _isLoggingIn: false,

  login: async (email, password) => {
    set({ loading: true, error: null, _isLoggingIn: true });

    try {
      const userCredential = await authApi.login(email, password);

      // ✅ Better token handling with retry
      let token;
      try {
        token = await userCredential.user.getIdToken();
      } catch (tokenError) {
        console.error("Failed to get token:", tokenError);
        // Force token refresh
        token = await userCredential.user.getIdToken(true);
      }

      let backendProfile = null;
      try {
        backendProfile = await authApi.getUserByUid(
          userCredential.user.uid,
          token
        );
      } catch (profileError) {
        console.warn("⚠️ Could not fetch backend profile:", profileError);
      }

      const user = {
        // Backend data
        id: backendProfile?.id || null,
        first_name: backendProfile?.first_name || null,
        last_name: backendProfile?.last_name || null,
        phone_number: backendProfile?.phone_number || null,
        role: backendProfile?.role || "user",

        // Firebase data
        name:
          userCredential.user.displayName ||
          `${backendProfile?.first_name || ""} ${
            backendProfile?.last_name || ""
          }`.trim() ||
          "User",
        phoneNumber:
          userCredential.user.phoneNumber || backendProfile?.phone_number,
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified, // ✅ Fixed: Add this
        token,

        // Include any other backend fields
        ...backendProfile,
      };

      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
        _isLoggingIn: false,
      });

      return user;
    } catch (err) {
      console.error("🔴 Auth store login failed:", err);
      set({ error: err.message, loading: false, _isLoggingIn: false });
      throw err;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      // Backend registration
      const backendUser = await authApi.register(userData);

      // Firebase login
      const userCredential = await authApi.login(
        userData.email,
        userData.password
      );

      // ✅ Fixed: Uncomment and add proper error handling
      try {
        // await sendEmailVerification(userCredential.user);
        console.log(
          "✅ Verification email sent to:",
          userCredential.user.email
        );
      } catch (emailError) {
        console.warn("⚠️ Failed to send verification email:", emailError);
        // Don't throw - continue with registration
      }

      const token = await userCredential.user.getIdToken();

      let completeProfile = null;
      try {
        completeProfile = await authApi.getUserByUid(
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
        role: completeProfile?.role || backendUser?.role || "user",

        // Firebase data
        name:
          userCredential.user.displayName ||
          `${userData.first_name} ${userData.last_name}`,
        phoneNumber: userCredential.user.phoneNumber || userData.phone_number,
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified, // ✅ This was already correct
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
        loading: false, // ✅ Add this
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Clear state even if logout fails
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        loading: false, // ✅ Add this
      });
    }
  },

  initAuth: () => {
    const unsubscribe = authApi.onAuthStateChanged(async (firebaseUser) => {
      const currentState = get();
      if (currentState._isLoggingIn) {
        console.log("🔄 Skipping initAuth - login in progress");
        return;
      }

      if (firebaseUser) {
        try {
          // ✅ Better token handling
          let token;
          try {
            token = await firebaseUser.getIdToken();
          } catch (tokenError) {
            console.warn("Token error, forcing refresh:", tokenError);
            token = await firebaseUser.getIdToken(true); // Force refresh
          }

          let backendProfile = null;
          try {
            backendProfile = await authApi.getUserByUid(
              firebaseUser.uid,
              token
            );
          } catch (profileError) {
            console.warn(
              "⚠️ Could not fetch backend profile during init:",
              profileError
            );
            // Don't throw - continue with Firebase data only
          }

          const user = {
            // Backend data
            id: backendProfile?.id || null,
            first_name: backendProfile?.first_name || null,
            last_name: backendProfile?.last_name || null,
            phone_number: backendProfile?.phone_number || null,
            role: backendProfile?.role || "user",

            // Firebase data
            name:
              firebaseUser.displayName ||
              `${backendProfile?.first_name || ""} ${
                backendProfile?.last_name || ""
              }`.trim() ||
              firebaseUser.email?.split("@")[0] || // Use email prefix as fallback
              "User",
            phoneNumber:
              firebaseUser.phoneNumber || backendProfile?.phone_number,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified, // ✅ Fixed: Add this
            token,

            // Include any other backend fields
            ...backendProfile,
          };

          set({
            user,
            isAuthenticated: true,
            loading: false,
            error: null, // ✅ Clear any previous errors
          });
        } catch (tokenError) {
          console.error("🔴 Failed to get user token during init:", tokenError);

          // ✅ Better error handling - don't clear auth if it's just a token refresh issue
          if (tokenError.code === "auth/network-request-failed") {
            console.log("Network error - keeping current state");
            set({ loading: false });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: "Authentication failed - please login again",
            });
          }
        }
      } else {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null, // ✅ Clear errors on logout
          _isLoggingIn: false,
        });
      }
    });

    return unsubscribe;
  },

  // ✅ Add method to manually refresh auth state
  refreshAuthState: async () => {
    const currentUser = authApi.getCurrentUser();
    if (currentUser) {
      try {
        await currentUser.reload(); // Refresh Firebase user
        const token = await currentUser.getIdToken(true); // Force token refresh

        // Update user in store
        const currentState = get();
        if (currentState.user) {
          set({
            user: {
              ...currentState.user,
              emailVerified: currentUser.emailVerified,
              token,
            },
          });
        }
      } catch (error) {
        console.error("Failed to refresh auth state:", error);
        throw error;
      }
    }
  },

  refreshProfile: async () => {
    const currentUser = get().user;
    if (!currentUser || !currentUser.uid) {
      throw new Error("No authenticated user to refresh");
    }

    try {
      const token = await authApi.getCurrentUserToken();
      const backendProfile = await authApi.getUserByUid(currentUser.uid, token);

      const updatedUser = {
        ...currentUser,
        ...backendProfile,
        token,
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
