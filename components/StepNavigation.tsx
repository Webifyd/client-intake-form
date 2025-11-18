'use client';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  completedSteps: number[];
}

const stepLabels = [
  'Company Info',
  'Campaign Details',
  'Budget & Products',
  'Strategy & Content',
  'Review & Submit',
];

export default function StepNavigation({
  currentStep,
  totalSteps,
  onStepClick,
  completedSteps,
}: StepNavigationProps) {
  return (
    <div className="w-full py-6 px-4 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        {/* Desktop Stepper */}
        <div className="hidden md:flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => {
            const isActive = step === currentStep;
            const isCompleted = completedSteps.includes(step);
            const isClickable = isCompleted || step < currentStep;

            return (
              <div key={step} className="flex items-center flex-1">
                {/* Step Circle */}
                <button
                  onClick={() => isClickable && onStepClick?.(step)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-webifyd-blue text-white ring-4 ring-webifyd-blue ring-opacity-30 scale-110'
                        : isCompleted
                        ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                        : 'bg-gray-200 text-gray-500'
                    }
                    ${isClickable && !isActive ? 'hover:scale-105' : ''}
                    ${!isClickable ? 'cursor-not-allowed' : ''}
                  `}
                >
                  {isCompleted && !isActive ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </button>

                {/* Step Label */}
                <div className="ml-3 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isActive ? 'text-webifyd-blue' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {stepLabels[index]}
                  </p>
                </div>

                {/* Connector Line */}
                {index < totalSteps - 1 && (
                  <div className="flex-1 px-4">
                    <div
                      className={`h-1 rounded-full transition-colors duration-300 ${
                        completedSteps.includes(step) ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Stepper - Simplified */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-webifyd-navy">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-xs text-gray-500">
              {completedSteps.length} completed
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mb-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
              const isActive = step === currentStep;
              const isCompleted = completedSteps.includes(step);

              return (
                <div
                  key={step}
                  className={`
                    h-2 flex-1 rounded-full transition-all duration-300
                    ${isActive ? 'bg-webifyd-blue' : isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                />
              );
            })}
          </div>

          {/* Current step label */}
          <p className="text-sm font-medium text-webifyd-blue text-center">
            {stepLabels[currentStep - 1]}
          </p>
        </div>
      </div>
    </div>
  );
}
