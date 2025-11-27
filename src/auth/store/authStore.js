import { create } from "zustand";
import authApi from "../services/authApi";
import { toast } from "sonner";

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
    "Something went wrong. Please try again or contact support"
  );
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  hasIncompleteProfile: false, // 🆕 NEW FLAG
  _isLoggingIn: false,
  _hasInitialized: false,

  login: async (email, password) => {
    set({
      loading: true,
      error: null,
      _isLoggingIn: true,
      hasIncompleteProfile: false,
    }); // 🆕 Reset flag

    try {
      // ✅ Step 1: Firebase login succeeds
      const userCredential = await authApi.login(email, password);

      // 🔄 Step 2: Try to fetch backend profile
      let backendProfile = null;
      let hasBackendData = false;

      try {
        backendProfile = await fetchBackendProfile(userCredential.user.uid);
        hasBackendData = !!backendProfile; // 🆕 Check if we got data
      } catch (profileError) {
        console.warn("⚠️ Could not fetch backend profile:", profileError);

        // 🆕 NOTIFY USER: Partial success
        toast.warning("Logged in with limited data", {
          description:
            "We couldn't load your complete profile. Some features may be unavailable.",
          duration: 6000,
          action: {
            label: "Contact Support",
          },
        });
      }

      // ✅ Build user object (works even without backend data)
      const user = buildUserObject(userCredential.user, backendProfile);

      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
        _isLoggingIn: false,
        _hasInitialized: true,
        hasIncompleteProfile: !hasBackendData, // 🆕 Set flag based on backend data
      });

      // 🎉 Success message (only if we got backend data)
      if (hasBackendData) {
        toast.success(`Welcome back, ${user.name || user.email}! 👋`);
      } else {
        // 🆕 Show Firebase-only success (no backend data)
        toast.info(`Signed in as ${user.email}`, {
          description: "Using basic profile data",
          icon: "⚡",
        });
      }

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
        hasIncompleteProfile: false, // 🆕 Reset on failure
      });

      toast.error(friendlyError, {
        duration: 5000,
        description: "Please check your credentials and try again",
      });

      throw new Error(friendlyError);
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null, hasIncompleteProfile: false }); // 🆕 Reset flag

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
        _hasInitialized: true,
        hasIncompleteProfile: false, // 🆕 Registration always has complete profile
      });

      toast.success("Account created successfully! 🎉");
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
        hasIncompleteProfile: false, // 🆕 Reset on failure
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
        _hasInitialized: true,
        hasIncompleteProfile: false, // 🆕 Reset on logout
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
            _hasInitialized: true,
            hasIncompleteProfile: !backendProfile, // 🆕 Set flag in initAuth too
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
              hasIncompleteProfile: false, // 🆕 Reset on failure
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
          error: shouldClearError ? null : currentState.error,
          _isLoggingIn: false,
          _hasInitialized: true,
          hasIncompleteProfile: false, // 🆕 Reset when logged out
        });
      }
    });

    return unsubscribe;
  },

  setUser: (updatedUser) => set({ user: updatedUser }),
  clearError: () => set({ error: null }),
}));

const fetchBackendProfile = async (uid) => {
  console.group("🔍 FETCH BACKEND PROFILE");
  console.log("📋 Input UID:", uid);
  console.log("📋 UID Type:", typeof uid);
  console.log("📋 UID Length:", uid?.length);
  console.log("📋 Timestamp:", new Date().toISOString());

  try {
    console.log("🌐 Making API call to /users/uid...");
    const startTime = performance.now();

    const profile = await authApi.getUserByUid(uid);

    const endTime = performance.now();
    console.log(
      `✅ API Response received in ${(endTime - startTime).toFixed(2)}ms`
    );
    console.log("📦 Backend Profile Data:", JSON.stringify(profile, null, 2));
    console.groupEnd();

    return profile;
  } catch (profileError) {
    console.error("❌ FETCH FAILED");
    console.log("🔴 Error Type:", profileError.constructor.name);
    console.log("🔴 Error Message:", profileError.message);
    console.log("🔴 Error Code:", profileError.code);
    console.log("🔴 Error Status:", profileError.status);
    console.log("🔴 Full Error:", JSON.stringify(profileError, null, 2));
    console.groupEnd();

    return null;
  }
};

const buildUserObject = (firebaseUser, backendProfile) => {
  console.group("🏗️ BUILD USER OBJECT");
  console.log("📋 Firebase User UID:", firebaseUser.uid);
  console.log("📋 Firebase User Email:", firebaseUser.email);
  console.log("📋 Backend Profile Exists:", !!backendProfile);

  if (backendProfile) {
    console.log("✅ Backend Profile:", {
      id: backendProfile.id,
      first_name: backendProfile.first_name,
      last_name: backendProfile.last_name,
      role: backendProfile.role,
    });
  } else {
    console.warn("⚠️ No backend profile - using Firebase data only");
  }

  const userObject = {
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
  };

  console.log("🎯 Final User Object:", JSON.stringify(userObject, null, 2));
  console.groupEnd();

  return userObject;
};
