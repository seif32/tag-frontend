import { AlertTriangle, RefreshCcw, X } from "lucide-react";

const ErrorMessage = ({
  message,
  variant = "destructive",
  dismissible = false,
  onDismiss,
  className = "",
}) => {
  // 🎨 Enhanced style variants with modern design
  const variants = {
    destructive: {
      container:
        "bg-gradient-to-r from-red-50 to-red-100/50 border-red-200/60 shadow-red-100/20",
      icon: "text-red-500",
      text: "text-red-800",
      button: "hover:bg-red-100/80 focus:ring-red-500/20",
      glow: "shadow-lg shadow-red-100/30",
    },
    warning: {
      container:
        "bg-gradient-to-r from-yellow-50 to-amber-50/50 border-yellow-200/60 shadow-yellow-100/20",
      icon: "text-yellow-600",
      text: "text-yellow-800",
      button: "hover:bg-yellow-100/80 focus:ring-yellow-500/20",
      glow: "shadow-lg shadow-yellow-100/30",
    },
    info: {
      container:
        "bg-gradient-to-r from-blue-50 to-sky-50/50 border-blue-200/60 shadow-blue-100/20",
      icon: "text-blue-500",
      text: "text-blue-800",
      button: "hover:bg-blue-100/80 focus:ring-blue-500/20",
      glow: "shadow-lg shadow-blue-100/30",
    },
  };

  const currentVariant = variants[variant];

  return (
    <div
      className={`
        relative flex items-start gap-4 p-5
        border rounded-xl backdrop-blur-sm
        ${currentVariant.container}
        ${currentVariant.glow}
        transform transition-all duration-300 ease-out
        hover:shadow-xl
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* ✨ Enhanced Background Pattern */}
      <div className="absolute inset-0 rounded-xl opacity-30">
        <div
          className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${currentVariant.icon.replace(
            "text-",
            "bg-"
          )}/10`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl ${currentVariant.icon.replace(
            "text-",
            "bg-"
          )}/5`}
        ></div>
      </div>

      {/* 🎯 Enhanced Error Icon with Animation */}
      <AlertTriangle
        className={`
            w-5 h-5 ${currentVariant.icon}
            animate-pulse
            drop-shadow-sm
          `}
        aria-hidden="true"
      />

      {/* 📝 Enhanced Message Content */}
      <div className="flex-1 min-w-0 relative">
        <p
          className={`
          text-sm font-medium leading-relaxed
          ${currentVariant.text}
          drop-shadow-sm
        `}
        >
          {message}
        </p>

        {/* Subtle underline effect */}
        <div
          className={`
          absolute bottom-0 left-0 h-0.5 w-0
          ${currentVariant.icon.replace("text-", "bg-")}/30
          transition-all duration-500 ease-out
          group-hover:w-full
        `}
        ></div>
      </div>

      {/* ❌ Enhanced Dismiss Button */}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className={`
            group relative flex-shrink-0 p-2.5 rounded-full
            ${currentVariant.button}
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              currentVariant.button.includes("ring-")
                ? currentVariant.button.split("ring-")[1]
                : "focus:ring-gray-500/20"
            }
            transition-all duration-200 ease-out
            hover:scale-110 active:scale-95
            backdrop-blur-sm
          `}
          aria-label="Dismiss error"
        >
          {/* Button background glow */}
          <div
            className={`
            absolute inset-0 rounded-full opacity-0
             transition-opacity duration-200
            ${currentVariant.icon.replace("text-", "bg-")}/20
          `}
          ></div>

          <RefreshCcw
            className={`
            w-4 h-4 relative z-10
            ${currentVariant.icon}
            group-hover:rotate-180 transition-transform duration-300
            drop-shadow-sm
          `}
          />
        </button>
      )}

      {/* ✨ Animated Border Effect */}
      <div
        className={`
        absolute inset-0 rounded-xl opacity-0
         transition-opacity duration-300
        bg-gradient-to-r ${currentVariant.icon.replace(
          "text-",
          "from-"
        )}-200/20 ${currentVariant.icon.replace("text-", "to-")}-300/10
        pointer-events-none
      `}
      ></div>
    </div>
  );
};

export default ErrorMessage;
