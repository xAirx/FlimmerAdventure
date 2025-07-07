import clsx from 'clsx';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage = ({ message, onRetry, className }: ErrorMessageProps) => {
  return (
    <div className={clsx('text-center py-8', className)}>
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">😵‍💫</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-4">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}; 