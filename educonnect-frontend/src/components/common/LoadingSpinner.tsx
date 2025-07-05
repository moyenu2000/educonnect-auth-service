import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2 className={`animate-spin text-primary-600 ${sizeClasses[size]}`} />
      {text && (
        <p className={`text-secondary-600 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Page loading component
export const PageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
    <LoadingSpinner size="xl" text={text} />
  </div>
);

// Inline loading component
export const InlineLoader: React.FC<{ text?: string }> = ({ text }) => (
  <div className="flex items-center justify-center py-8">
    <LoadingSpinner size="md" text={text} />
  </div>
);

// Button loading state
export const ButtonLoader: React.FC = () => (
  <LoadingSpinner size="sm" className="mr-2" />
);