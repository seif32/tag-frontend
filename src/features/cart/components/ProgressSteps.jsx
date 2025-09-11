// components/ProgressSteps.jsx
import { FiShoppingCart, FiCreditCard, FiCheckCircle } from "react-icons/fi";
import { BsCheck2 } from "react-icons/bs";

const ProgressSteps = ({ currentStep }) => {
  const steps = [
    {
      number: 1,
      label: "Shopping Cart",
      path: "/cart",
      icon: FiShoppingCart,
      description: "Review your items",
    },
    {
      number: 2,
      label: "Checkout",
      path: "/checkout",
      icon: FiCreditCard,
      description: "Payment & shipping",
    },
    {
      number: 3,
      label: "Order Complete",
      path: "/success",
      icon: FiCheckCircle,
      description: "Success!",
    },
  ];

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) {
      return currentStep === 3 ? "completed" : "active";
    }
    return "pending";
  };

  return (
    <div className="w-full px-4 py-8  ">
      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const status = getStepStatus(step.number);
            const Icon = step.icon;

            return (
              <div key={step.number} className="flex items-center">
                {/* Step Container */}
                <div className="flex flex-col items-center text-center min-w-[160px]">
                  {/* Step Circle */}
                  <div
                    className={`
                      relative w-16 mb-3 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg
                      ${
                        status === "completed"
                          ? "bg-green-500 border-green-500 text-white "
                          : status === "active"
                          ? "bg-primary border-primary text-white animate-pulse "
                          : "bg-white  border-gray-300 text-gray-400 "
                      }
                    `}
                  >
                    {status === "completed" ? (
                      <BsCheck2 className="w-8 h-8 font-bold" />
                    ) : (
                      <Icon className="w-7 h-7" />
                    )}

                    {/* Active step ring */}
                    {status === "active" && (
                      <div className="absolute border-2 rounded-full border-primary/30 -inset-2 animate-ping" />
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="space-y-1">
                    <p
                      className={`text-sm font-semibold transition-colors duration-300 ${
                        status === "completed" || status === "active"
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-xs transition-colors duration-300 ${
                        status === "completed" || status === "active"
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 px-8">
                    <div className="relative">
                      <div
                        className={`h-1 rounded-full transition-all duration-500 ease-in-out ${
                          step.number < currentStep
                            ? "bg-green-500 "
                            : "bg-gray-300"
                        }`}
                        style={{ minWidth: "80px" }}
                      />
                      {/* Animated dots for active connection */}
                      {/* {step.number < currentStep && (
                        <div className="absolute top-0 left-0 w-full h-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 animate-pulse" />
                      )} */}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="max-w-sm mx-auto">
          {/* Progress Background Line */}
          <div className="relative ">
            <div className="absolute h-1 bg-gray-300 rounded-full top-8 left-8 right-8" />
            <div
              className="absolute h-1 transition-all duration-700 ease-out rounded-full shadow-sm bg-green-500 top-8 left-8"
              style={{
                width: `calc(${
                  ((currentStep - 1) / (steps.length - 1)) * 100
                }% - 0px)`,
                maxWidth: "calc(100% - 64px)",
              }}
            />

            {/* Step Dots */}
            <div className="relative flex justify-between px-8">
              {steps.map((step) => {
                const status = getStepStatus(step.number);
                const Icon = step.icon;

                return (
                  <div key={step.number} className="flex flex-col items-center">
                    <div
                      className={`
                        w-16 h-16 rounded-full border-3 flex items-center justify-center transition-all duration-300 bg-white shadow-lg
                        ${
                          status === "completed"
                            ? "border-green-500 text-green-500 shadow-green-100"
                            : status === "active"
                            ? "border-primary text-primary shadow-primary/10"
                            : "border-gray-300 text-gray-400 shadow-gray-100"
                        }
                      `}
                    >
                      {status === "completed" ? (
                        <BsCheck2 className="w-8 h-8 font-bold" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    {/* Step Number */}
                    <div className="mt-2 mb-1">
                      <span
                        className={`
                          inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full
                          ${
                            status === "completed" || status === "active"
                              ? "bg-primary/10 text-primary"
                              : "bg-gray-100 text-gray-400"
                          }
                        `}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Step Label - Only show current step on mobile */}
                    {status === "active" && (
                      <div className="space-y-1 text-center">
                        <p className="text-sm font-semibold text-gray-900">
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-600">
                          Step {step.number} of {steps.length}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
