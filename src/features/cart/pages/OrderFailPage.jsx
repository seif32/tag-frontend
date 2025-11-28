import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { XCircle, Home, RefreshCcw, MessageCircle } from "lucide-react";
import { ROUTES } from "@/constants";

function OrderFailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get error details from URL params (if any)
  const errorMessage =
    searchParams.get("message") || "Payment was not completed";
  const errorType = searchParams.get("type") || "payment_failed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Order Failed</h1>
            <p className="text-red-50 text-lg">
              We couldn't process your order
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">
                    {getErrorTitle(errorType)}
                  </h3>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>

            {/* What Happened */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                What happened?
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Your order was not completed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>No payment was charged to your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Your cart items are still saved</span>
                </li>
              </ul>
            </div>

            {/* What to do next */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                What can you do?
              </h2>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <RefreshCcw className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Try Again
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Check your payment details and try placing the order again
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Contact Support
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Need help? Our support team is ready to assist you
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* <Button
                onClick={() => navigate(ROUTES.CUSTOMER.CART)}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Return to Cart
              </Button> */}
              <Button
                onClick={() => navigate("/chat")}
                variant="outline"
                className="flex-1"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              If you continue to experience issues, please contact our support
              team
              {/* <a
                href="mailto:support@tagenterprises.com"
                className="text-blue-600 hover:underline"
              >
                support@tagenterprises.com
              </a> */}
            </p>
          </div>
        </div>

        {/* Common Issues Card */}
        <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Common Issues & Solutions
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-medium text-gray-700 min-w-[140px]">
                Payment Declined:
              </span>
              <span className="text-gray-600">
                Check your card details and available balance
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-gray-700 min-w-[140px]">
                Network Error:
              </span>
              <span className="text-gray-600">
                Check your internet connection and try again
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderFailPage;

// Helper function to get error title based on type
function getErrorTitle(errorType) {
  const titles = {
    payment_failed: "Payment Failed",
    payment_declined: "Payment Declined",
    network_error: "Network Error",
    timeout: "Request Timeout",
    invalid_data: "Invalid Order Data",
    server_error: "Server Error",
    default: "Order Processing Failed",
  };

  return titles[errorType] || titles.default;
}
