import React from 'react';
import { XCircleIcon } from '@heroicons/react/solid';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;