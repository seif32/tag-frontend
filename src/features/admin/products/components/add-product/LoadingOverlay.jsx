import { Loader2, Upload, CheckCircle2, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingOverlay({
  isVisible,
  progress = 0,
  stage = "preparing",
}) {
  if (!isVisible) return null;

  const stages = {
    preparing: {
      icon: Package,
      title: "Preparing Product",
      description: "Validating product information...",
    },
    uploading: {
      icon: Upload,
      title: "Uploading Images",
      description: "Uploading product images to cloud storage...",
    },
    saving: {
      icon: Loader2,
      title: "Saving Product",
      description: "Creating product and variants in database...",
    },
    complete: {
      icon: CheckCircle2,
      title: "Product Created!",
      description: "Redirecting to product list...",
    },
  };

  const currentStage = stages[stage] || stages.preparing;
  const Icon = currentStage.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center",
                stage === "complete"
                  ? "bg-green-100"
                  : "bg-blue-100 animate-pulse"
              )}
            >
              <Icon
                className={cn(
                  "w-10 h-10",
                  stage === "complete" ? "text-green-600" : "text-blue-600",
                  stage === "saving" && "animate-spin"
                )}
              />
            </div>
            {stage !== "complete" && (
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {currentStage.title}
          </h3>
          <p className="text-sm text-gray-600">{currentStage.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500 ease-out rounded-full",
                stage === "complete" ? "bg-green-500" : "bg-blue-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="flex justify-between items-center pt-4">
          {["preparing", "uploading", "saving", "complete"].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  stages[stage] === stages[s] ||
                    idx < Object.keys(stages).indexOf(stage)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-400"
                )}
              >
                {idx + 1}
              </div>
              {idx < 3 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-1 transition-colors",
                    idx < Object.keys(stages).indexOf(stage)
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Helper Text */}
        <p className="text-xs text-center text-gray-500">
          Please don't close this window...
        </p>
      </div>
    </div>
  );
}
