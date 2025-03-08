// src/components/atoms/toast/SuccessToast.tsx

import React from "react";
import { CheckCircle2Icon } from "lucide-react";

interface SuccessToastProps {
  message: string;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message }) => {
  return (
    <div
      className="max-w-sm w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3"
      role="alert"
      aria-live="assertive"
    >
      <CheckCircle2Icon className="h-6 w-6 text-green-500 flex-shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default SuccessToast;
