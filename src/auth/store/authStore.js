import { create } from "zustand";
import authApi from "../services/authApi";

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
      const backendProfile = await fetchBackendProfile(userCredential.user.uid);

      const user = buildUserObject(userCredential.user, backendProfile);

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
      const backendUser = await authApi.register(userData);

      const userCredential = await authApi.login(
        userData.email,
        userData.password
      );

      try {
        console.log(
          "✅ Verification email sent to:",
          userCredential.user.email
        );
      } catch (emailError) {
        console.warn("⚠️ Failed to send verification email:", emailError);
      }

      const completeProfile =
        (await fetchBackendProfile(userCredential.user.uid)) || backendUser;

      const user = buildUserObject(userCredential.user, completeProfile);

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
          const backendProfile = await fetchBackendProfile(firebaseUser.uid);

          const user = buildUserObject(firebaseUser, backendProfile);
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
}));

const fetchBackendProfile = async (uid) => {
  try {
    return await authApi.getUserByUid(uid);
  } catch (profileError) {
    console.warn("⚠️ Could not fetch backend profile:", profileError);
    return null;
  }
};

const buildUserObject = (firebaseUser, backendProfile) => ({
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
