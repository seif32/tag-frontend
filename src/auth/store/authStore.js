import { create } from "zustand";
import authApi from "../services/authApi";
import { toast } from "sonner";

// 🆕 Error message mapper
// 🆕 Enhanced error mapper with emojis and friendly language
const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    // 🔐 Authentication Errors
    "auth/email-already-in-use":
      "This email is already registered. Try logging in instead!",

    "auth/invalid-email": "Please enter a valid email address",

    "auth/weak-password":
      "Your password is too weak. Use at least 6 characters for security",

    "auth/user-not-found":
      "We couldn't find an account with this email. Want to sign up?",

    "auth/wrong-password": "Incorrect password. Please try again",

    "auth/invalid-credential":
      "Invalid email or password. Please check your credentials",

    // ⏱️ Security & Rate Limiting
    "auth/too-many-requests":
      "Too many login attempts. Please wait a few minutes and try again",

    // 🌐 Network Errors
    "auth/network-request-failed":
      "Network connection issue. Please check your internet and try again",

    // 🚫 Account Status
    "auth/user-disabled":
      "This account has been disabled. Contact support for help",

    // ✉️ Email Verification
    "auth/email-already-verified":
      "Your email is already verified! You're good to go",

    "auth/invalid-action-code":
      "This verification link is invalid or expired. Request a new one",
  };

  return (
    errorMessages[errorCode] ||
    "Something went wrong. Please try again or contact support 💬"
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
        error: null,
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
      });

      // 🆕 Use error toast with custom styling
      toast.error(friendlyError, {
        duration: 5000, // Show for 5 seconds
        description: "Please check your credentials and try again",
      });

      throw new Error(friendlyError);
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
        const shouldClearError =
          !currentState.error || currentState._isLoggingIn;

        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: shouldClearError ? null : currentState.error, // ✅ Preserve error
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
  emailVerified: backendProfile?.is_verified,

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
