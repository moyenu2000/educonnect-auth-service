import React, { forwardRef } from 'react';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: IconComponent;
  rightIcon?: IconComponent;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    leftIcon: LeftIcon, 
    rightIcon: RightIcon, 
    onRightIconClick,
    className = '',
    ...props 
  }, ref) => {
    const hasError = !!error;
    
    const inputClasses = `
      block w-full px-3 py-2 border rounded-md shadow-sm placeholder-secondary-400 
      focus:outline-none focus:ring-1 transition-colors duration-200
      ${LeftIcon ? 'pl-10' : ''}
      ${RightIcon ? 'pr-10' : ''}
      ${hasError 
        ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
        : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
      }
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-secondary-400" />
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
          
          {RightIcon && (
            <div 
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'
              }`}
              onClick={onRightIconClick}
            >
              <RightIcon className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
        )}
      </div>
    );
  }
);