import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/auth/store/authStore";
import { toast } from "sonner";

function VerificationPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log("🔥 VerificationPage mounted");
    handleEmailVerification();
  }, []);

  async function handleEmailVerification() {
    try {
      // ✅ Step 1: Parse URL parameters
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");

      console.log("🔍 URL Parameters:", {
        email,
        fullUrl: window.location.href,
      });

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

      // ✅ Step 3: Call backend verification endpoint
      console.log("🔍 Calling backend verification for:", email);
      setDebugInfo((prev) => ({ ...prev, step: "calling-backend" }));

      const response = await fetch(
        "http://localhost:3000/api/users/verify-email",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      console.log("🔍 Backend response:", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      setDebugInfo((prev) => ({
        ...prev,
        step: "backend-responded",
        status: response.status,
        ok: response.ok,
      }));

      // ✅ Step 4: Handle backend response
      if (!response.ok) {
        let errorMessage = "Email verification failed";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("❌ Backend error:", errorData);

          setDebugInfo((prev) => ({
            ...prev,
            step: "backend-error",
            errorData,
          }));
        } catch (parseError) {
          console.error("❌ Error parsing backend error response:", parseError);
        }

        if (response.status === 404) {
          setStatus("error");
          setMessage("Email not found or already verified.");
        } else if (response.status === 400) {
          setStatus("error");
          setMessage("Invalid verification request.");
        } else if (response.status >= 500) {
          setStatus("error");
          setMessage("Server error occurred. Please try again later.");
        } else {
          setStatus("error");
          setMessage(errorMessage);
        }
        return;
      }

      // ✅ Step 5: Success response
      let responseData = {};
      try {
        responseData = await response.json();
        console.log("✅ Verification successful:", responseData);
      } catch (parseError) {
        console.warn(
          "⚠️ Could not parse success response, but verification completed"
        );
      }

      setDebugInfo((prev) => ({
        ...prev,
        step: "verification-completed",
        responseData,
      }));

      // ✅ Step 6: Show success and redirect
      setStatus("success");
      setMessage(`Email ${email} verified successfully!`);
      toast.success("Email verified! 🎉");

      // Navigate based on user role after delay
      setTimeout(() => {
        console.log("🔄 Redirecting user...", { userRole: user?.role });

        if (user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (networkError) {
      console.error("💥 Network error during verification:", networkError);

      setDebugInfo((prev) => ({
        ...prev,
        step: "network-error",
        error: networkError.message,
        stack: networkError.stack,
      }));

      setStatus("error");
      setMessage(
        "Network error occurred. Please check your connection and try again."
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {status === "loading" && (
          <div>
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-xl font-semibold mb-2">
              Verifying your email...
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your email address.
            </p>

            {/* ✅ Debug Info Panel (development only) */}
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
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Email Verified!
            </h2>
            <p className="mb-4 text-gray-700">{message}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
              <span>Redirecting you to your dashboard...</span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Verification Failed
            </h2>
            <p className="mb-6 text-gray-700">{message}</p>

            {/* ✅ Debug Info Panel for errors (development only) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                <h4 className="font-bold mb-2 text-sm text-red-700">
                  Debug Info:
                </h4>
                <pre className="text-xs text-red-600 overflow-auto max-h-32">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerificationPage;
