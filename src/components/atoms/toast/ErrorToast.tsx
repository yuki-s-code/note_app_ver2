// src/components/atoms/toast/ErrorToast.tsx

import React from "react";
import { XCircleIcon } from "lucide-react";

interface ErrorToastProps {
  message: string;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message }) => {
  return (
    <div
      className="max-w-sm w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3"
      role="alert"
      aria-live="assertive"
    >
      <XCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default ErrorToast;
