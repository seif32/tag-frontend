import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/auth/store/authStore";
import { toast } from "sonner";
import LoadingState from "@/ui/LoadingState";
import authApi from "../services/authApi";

function VerificationPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    handleEmailVerification();
  }, []);

  async function handleEmailVerification() {
    try {
      // ✅ Step 1: Parse URL parameters
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");

      setDebugInfo({
        step: "parsing-params",
        email,
        hasEmail: !!email,
      });

      // ✅ Step 2: Validate email parameter
      if (!email) {
        console.error("❌ Missing email parameter");
        setStatus("error");
        setMessage("Invalid verification link. Missing email parameter.");
        setDebugInfo((prev) => ({ ...prev, error: "missing-email" }));
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error("❌ Invalid email format:", email);
        setStatus("error");
        setMessage("Invalid email format in verification link.");
        setDebugInfo((prev) => ({
          ...prev,
          error: "invalid-email-format",
          email,
        }));
        return;
      }

      // ✅ Step 3: Call backend verification endpoint using API helper
      setDebugInfo((prev) => ({ ...prev, step: "calling-backend" }));

      const responseData = await authApi.verifyEmail();

      setDebugInfo((prev) => ({
        ...prev,
        step: "verification-completed",
        responseData,
      }));

      // ✅ Step 4: Success response
      setStatus("success");
      setMessage(`Email ${email} verified successfully!`);

      // Navigate based on user role after delay
      setTimeout(() => {
        if (user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (error) {
      console.error("💥 Verification error:", error);

      setDebugInfo((prev) => ({
        ...prev,
        step: "verification-failed",
        error: error.message,
        status: error.status,
        details: error.details,
      }));

      // ✅ Handle different error types
      let errorMessage = "Email verification failed";

      if (error.status === 404) {
        errorMessage = "Email not found or already verified.";
      } else if (error.status === 400) {
        errorMessage =
          error.details?.error ||
          "Invalid verification request or email not verified yet.";
      } else if (error.status >= 500) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (error.message.includes("Network request failed")) {
        errorMessage =
          "Network error occurred. Please check your connection and try again.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      setStatus("error");
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === "loading" && (
          <div>
            <LoadingState />
            <h2 className="text-xl font-semibold mb-2 text-blue-700">
              Hang tight, we're verifying!
            </h2>
            <p className="text-gray-600 mb-2">
              Ensuring your email is secure...
            </p>
            {debugInfo.email && (
              <p className="text-xs text-gray-400 mt-2">
                Email: {debugInfo.email}
              </p>
            )}
            {/* Debug Info Panel (development only) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
                <h4 className="font-bold mb-2 text-sm">Debug Info:</h4>
                <pre className="text-xs text-gray-700 overflow-auto max-h-32">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {status === "success" && (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-green-600">
              Success! Email Verified
            </h2>
            <p className="mb-4 text-gray-700">{message}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <LoadingState />
              <span>Redirecting to your dashboard...</span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="text-6xl mb-2">😓</div>
            <h2 className="text-2xl font-bold mb-2 text-red-600">
              Verification Didn't Work
            </h2>
            <p className="mb-4 text-gray-700">{message}</p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-black text-white px-4 py-2 rounded hover:bg-black/70 transition"
                autoFocus
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Back to Login
              </button>
            </div>
            {/* Debug Info Panel for errors (development only) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg text-left">
                <h4 className="font-bold mb-2 text-sm text-red-700">
                  Debug Info:
                </h4>
                <pre className="text-xs text-red-600 overflow-auto max-h-32">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VerificationPage;
