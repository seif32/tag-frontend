import { useLocation } from "react-router";
import { useAuthStore } from "@/auth/store/authStore";
import { toast } from "sonner";
import authApi from "../services/authApi";

function CheckEmailPage() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const email = location.state?.email || user?.email;

  async function handleResendEmail() {
    try {
      if (!email) {
        toast.error("Email address not found");
        return;
      }

      await authApi.resendVerificationEmail(email);
      toast.success("Verification email resent!");
    } catch (error) {
      // Handle specific error cases
      if (error.status === 400) {
        toast.error("Email already verified ");
      } else {
        toast.error("Failed to resend email. Please try again.");
      }
      console.error("Resend verification error:", error);
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckEmailPage;
