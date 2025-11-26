import { create } from "zustand";
import authApi from "../services/authApi";
import { toast } from "sonner";

// 🆕 Error message mapper
const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    "auth/email-already-in-use":
      "This email is already registered. Please login instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password is too weak. Use at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/user-disabled": "This account has been disabled.",
  };

  return (
    errorMessages[errorCode] ||
    "An unexpected error occurred. Please try again."
  );
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true, // ✅ Start as true
  error: null,
  _isLoggingIn: false,
  _hasInitialized: false, // 🆕 Track if auth has initialized

  login: async (email, password) => {
    set({ loading: true, error: null, _isLoggingIn: true });

    try {
      const userCredential = await authApi.login(email, password);
      const backendProfile = await fetchBackendProfile(userCredential.user.uid);
      const user = buildUserObject(userCredential.user, backendProfile);

      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null, // ✅ Clear error on success
        _isLoggingIn: false,
        _hasInitialized: true,
      });

      toast.success(`Welcome back, ${user.name || user.email}! 👋`);
      return user;
    } catch (err) {
      console.error("🔴 Auth store login failed:", err);
      const friendlyError = getFirebaseErrorMessage(err.code);

      set({
        error: friendlyError,
        loading: false,
        _isLoggingIn: false,
        isAuthenticated: false,
        user: null,
        // ❌ Don't set _hasInitialized here - keeps error visible
      });

      throw err; // ✅ Re-throw so LoginPage can catch it
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
        await authApi.sendVerificationEmail(userCredential.user);
      } catch (emailError) {
        console.warn("⚠️ Failed to send verification email:", emailError);
      }

      const completeProfile =
        (await fetchBackendProfile(userCredential.user.uid)) || backendUser;

      const user = buildUserObject(userCredential.user, completeProfile);

      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
        _hasInitialized: true, // 🆕 Mark as initialized
      });

      toast.success("Account created successfully!");
      return user;
    } catch (err) {
      console.error("🔴 Registration failed:", err);

      const friendlyError = err.code
        ? getFirebaseErrorMessage(err.code)
        : err.message || "Registration failed.";

      set({
        error: friendlyError,
        loading: false,
        isAuthenticated: false,
        user: null,
      });
      throw new Error(friendlyError);
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
      toast.info("You've been logged out. 👋");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        _isLoggingIn: false,
        _hasInitialized: true, // ✅ Keep initialized
      });
    }
  },

  initAuth: () => {
    const unsubscribe = authApi.onAuthStateChanged(async (firebaseUser) => {
      const currentState = get();

      // 🆕 Skip ONLY during active login operation
      if (currentState._isLoggingIn) {
        console.log("🔄 Skipping initAuth - login in progress");
        return;
      }

      if (firebaseUser) {
        try {
          const backendProfile = await fetchBackendProfile(firebaseUser.uid);
          const user = buildUserObject(firebaseUser, backendProfile);

          set({
            user,
            isAuthenticated: true,
            loading: false,
            error: null,
            _hasInitialized: true, // 🆕 Mark as initialized
          });
        } catch (tokenError) {
          console.error("🔴 Failed during init:", tokenError);

          if (tokenError.code === "auth/network-request-failed") {
            set({ loading: false, _hasInitialized: true });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: "Authentication failed",
              _hasInitialized: true,
            });
          }
        }
      } else {
        // 🆕 User logged out or no session
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
          _isLoggingIn: false,
          _hasInitialized: true,
        });
      }
    });

    return unsubscribe;
  },

  setUser: (updatedUser) => set({ user: updatedUser }),
  clearError: () => set({ error: null }),
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
  emailVerified: backendProfile.is_verified,

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
