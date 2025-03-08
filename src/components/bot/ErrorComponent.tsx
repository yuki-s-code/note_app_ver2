// components/ErrorComponent.tsx
import React, { FC } from "react";
import { Button } from "@material-tailwind/react";
import { RefreshCcw } from "lucide-react";

interface ErrorComponentProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorComponent: FC<ErrorComponentProps> = ({
  message = "データの取得中にエラーが発生しました。",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <p className="text-red-500 mb-4">{message}</p>
      {onRetry && (
        <Button
          placeholder="true"
          onPointerEnterCapture
          onPointerLeaveCapture
          variant="outlined"
          color="red"
          className="flex items-center gap-2"
          onClick={onRetry}
          aria-label="再試行"
        >
          <RefreshCcw className="h-4 w-4" /> 再試行
        </Button>
      )}
    </div>
  );
};

export { ErrorComponent };
