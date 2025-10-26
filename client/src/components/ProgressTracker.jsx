import React from 'react';

const ProgressTracker = ({ steps, currentStep }) => {
  return (
    <div className="progress-tracker">
      <div className="progress-steps">
        <div className="progress-line"></div>
        <div 
          className="progress-fill"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>

        {steps.map((step, index) => (
          <div key={index} className="step">
            <div 
              className={`step-circle ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className={`step-label ${index === currentStep ? 'active' : ''}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="step-indicator">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
      </div>
    </div>
  );
};

export default ProgressTracker;
