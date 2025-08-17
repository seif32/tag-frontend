import { AlertTriangle, X } from "lucide-react";

/**
 * 🎨 Modern Error Message Component
 * Perfect for forms, API errors, and user feedback
 *
 * @param {string} message - The error message to display
 * @param {string} variant - 'destructive' | 'warning' | 'info'
 * @param {boolean} dismissible - Whether the error can be dismissed
 * @param {function} onDismiss - Callback when error is dismissed
 * @param {string} className - Additional Tailwind classes
 */
const ErrorMessage = ({
  message,
  variant = "destructive",
  dismissible = false,
  onDismiss,
  className = "",
}) => {
  // 🎨 Style variants for different error types
  const variants = {
    destructive: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: "text-red-500",
      text: "text-red-800",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: "text-yellow-500",
      text: "text-yellow-800",
    },
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: "text-blue-500",
      text: "text-blue-800",
    },
  };

  const currentVariant = variants[variant];

  return (
    <div
      className={`
        flex items-start gap-3 p-4
        border rounded-lg shadow-sm
        ${currentVariant.container}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* 🎯 Error Icon */}
      <AlertTriangle
        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${currentVariant.icon}`}
        aria-hidden="true"
      />

      {/* 📝 Error Message */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${currentVariant.text}`}>
          {message}
        </p>
      </div>

      {/* ❌ Dismiss Button (Optional) */}
      {dismissible && (
        <button
          onClick={onDismiss}
          className={`
            flex-shrink-0 p-1 rounded-md
            hover:bg-black/5 focus:outline-none
            focus:ring-2 focus:ring-offset-1 focus:ring-red-500
            transition-colors duration-200
            ${currentVariant.icon}
          `}
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
