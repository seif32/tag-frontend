import { create } from "zustand";
import authApi from "../services/authApi";

// 🏪 Main Auth Store
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
      const token = await getTokenWithRetry(userCredential.user);
      const backendProfile = await fetchBackendProfile(
        userCredential.user.uid,
        token
      );

      const user = buildUserObject(userCredential.user, backendProfile, token);

      set({
        ...get(),
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
        _isLoggingIn: false,
      });

      return user;
    } catch (err) {
      console.error("🔴 Auth store login failed:", err);
      set({
        ...get(),
        error: err.message,
        loading: false,
        _isLoggingIn: false,
      });
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

      // Optional: Send verification email
      try {
        console.log(
          "✅ Verification email sent to:",
          userCredential.user.email
        );
      } catch (emailError) {
        console.warn("⚠️ Failed to send verification email:", emailError);
      }

      const token = await getTokenWithRetry(userCredential.user);
      const completeProfile =
        (await fetchBackendProfile(userCredential.user.uid, token)) ||
        backendUser;

      const user = buildUserObject(userCredential.user, completeProfile, token);

      setAuthenticatedState(set, user);
      return user;
    } catch (err) {
      set({ ...get(), error: err.message, loading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear state, even if logout fails
      setUnauthenticatedState(set);
    }
  },

  initAuth: () => {
    const unsubscribe = authApi.onAuthStateChanged(async (firebaseUser) => {
      const currentState = get();

      // Skip if login is in progress
      if (currentState._isLoggingIn) {
        console.log("🔄 Skipping initAuth - login in progress");
        return;
      }

      if (firebaseUser) {
        try {
          const token = await getTokenWithRetry(firebaseUser);
          const backendProfile = await fetchBackendProfile(
            firebaseUser.uid,
            token
          );

          const user = buildUserObject(firebaseUser, backendProfile, token);
          setAuthenticatedState(set, user);
        } catch (tokenError) {
          console.error("🔴 Failed to get user token during init:", tokenError);

          // Handle network errors gracefully
          if (tokenError.code === "auth/network-request-failed") {
            console.log("Network error - keeping current state");
            set({ ...get(), loading: false });
          } else {
            setUnauthenticatedState(
              set,
              "Authentication failed - please login again"
            );
          }
        }
      } else {
        setUnauthenticatedState(set);
      }
    });

    return unsubscribe;
  },

  refreshAuthState: async () => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) return;

    try {
      await currentUser.reload(); // Refresh Firebase user
      const token = await currentUser.getIdToken(true); // Force token refresh

      const currentState = get();
      if (currentState.user) {
        set({
          ...currentState,
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
  },

  refreshProfile: async () => {
    const currentUser = get().user;
    if (!currentUser?.uid) {
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

      set({ ...get(), user: updatedUser });
      return updatedUser;
    } catch (error) {
      console.error("Failed to refresh profile:", error);
      throw error;
    }
  },

  updateProfile: async (updateData) => {
    const currentUser = get().user;
    if (!currentUser?.id) {
      throw new Error("No authenticated user to update");
    }

    try {
      const token = await authApi.getCurrentUserToken();
      const updatedProfile = await authApi.updateUser(
        currentUser.id,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = {
        ...currentUser,
        ...updatedProfile,
      };

      set({ ...get(), user: updatedUser });
      return updatedUser;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  },

  clearError: () => {
    set({ ...get(), error: null });
  },
}));

/*🔴🔴🔴🔴🔴🔴🔴 Helper Functions*/

const getTokenWithRetry = async (firebaseUser) => {
  try {
    return await firebaseUser.getIdToken();
  } catch (tokenError) {
    console.warn("Token error, forcing refresh:", tokenError);
    return await firebaseUser.getIdToken(true); // Force refresh
  }
};

const fetchBackendProfile = async (uid, token) => {
  try {
    return await authApi.getUserByUid(uid, token);
  } catch (profileError) {
    console.warn("⚠️ Could not fetch backend profile:", profileError);
    return null;
  }
};

const buildUserObject = (firebaseUser, backendProfile, token) => ({
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
    firebaseUser.email?.split("@")[0] ||
    "User",
  phoneNumber: firebaseUser.phoneNumber || backendProfile?.phone_number,
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  emailVerified: firebaseUser.emailVerified,
  token,

  // Include any other backend fields
  ...backendProfile,
});

const setAuthenticatedState = (set, user) => {
  set({
    user,
    isAuthenticated: true,
    loading: false,
    error: null,
  });
};

const setUnauthenticatedState = (set, error = null) => {
  set({
    user: null,
    isAuthenticated: false,
    loading: false,
    error,
    _isLoggingIn: false,
  });
};
