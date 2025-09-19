import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/auth/store/authStore";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "../firebase/config";

function CheckEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const email = location.state?.email || user?.email;

  async function handleResendEmail() {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        toast.success("Verification email resent! 📧");
      }
    } catch (error) {
      toast.error("Failed to resend email");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-4">We sent a verification link to:</p>
          <p className="font-semibold text-blue-600 mb-6">{email}</p>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Click the link in your email to verify your account
            </p>

            <button
              onClick={handleResendEmail}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Didn't receive the email? Click to resend
            </button>

            <div className="pt-4 border-t">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckEmailPage;
