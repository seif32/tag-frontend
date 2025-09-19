import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAuth, applyActionCode, checkActionCode } from "firebase/auth";
import { useAuthStore } from "@/auth/store/authStore";
import { toast } from "sonner";

function VerificationPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    handleVerifyPage();
  }, []);

  async function handleVerifyPage() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");

    if (mode !== "verifyEmail" || !oobCode) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    const auth = getAuth();
    try {
      // Check the code
      const info = await checkActionCode(auth, oobCode);
      const email = info.data?.email || info.email;

      // Apply verification
      await applyActionCode(auth, oobCode);

      // Sync with backend
      await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setStatus("success");
      setMessage(`Email ${email} verified successfully!`);
      toast.success("Email verified! 🎉");

      // Navigate based on user role
      setTimeout(() => {
        if (user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (err) {
      setStatus("error");
      setMessage("Verification failed. Link may be expired.");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {status === "loading" && (
          <div>
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Email Verified!
            </h2>
            <p className="mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting you to your dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Verification Failed
            </h2>
            <p className="mb-6">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerificationPage;
