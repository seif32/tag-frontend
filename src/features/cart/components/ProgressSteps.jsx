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
    if (stepNumber === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="w-full px-4 py-6 mb-8 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        {/* Desktop Progress Bar */}
        <div className="items-center justify-between hidden md:flex">
          {steps.map((step, index) => {
            const status = getStepStatus(step.number);
            const Icon = step.icon;

            return (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                    relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${
                      status === "completed"
                        ? "bg-green-500 border-green-500 text-white"
                        : status === "active"
                        ? "bg-primary border-primary text-white animate-pulse"
                        : "bg-white border-gray-300 text-gray-400"
                    }
                  `}
                  >
                    {status === "completed" ? (
                      <BsCheck2 className="w-6 h-6 font-bold" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}

                    {/* Active step ring */}
                    {status === "active" && (
                      <div className="absolute border-2 rounded-full border-primary/20 -inset-1 animate-ping" />
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${
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
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-0.5 transition-colors duration-500 ${
                        step.number < currentStep
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden">
          {/* Progress Line */}
          <div className="relative mb-8">
            <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-300" />
            <div
              className="absolute top-6 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />

            {/* Step Dots */}
            <div className="relative flex justify-between">
              {steps.map((step) => {
                const status = getStepStatus(step.number);
                const Icon = step.icon;

                return (
                  <div key={step.number} className="flex flex-col items-center">
                    <div
                      className={`
                      w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-white
                      ${
                        status === "completed"
                          ? "border-green-500 text-green-500"
                          : status === "active"
                          ? "border-primary text-accent"
                          : "border-gray-300 text-gray-400"
                      }
                    `}
                    >
                      {status === "completed" ? (
                        <BsCheck2 className="w-6 h-6 font-bold" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Step Label - Only show current step on mobile */}
                    {status === "active" && (
                      <div className="mt-3 text-center">
                        <p className="text-sm font-medium text-gray-900">
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
