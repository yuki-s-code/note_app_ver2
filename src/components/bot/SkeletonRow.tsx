// components/SkeletonRow.tsx
import React, { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonRow: FC = () => {
  return (
    <tr>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="flex items-start w-[400px] gap-3">
          <ul className="list-disc pl-5">
            {Array.from({ length: 2 }).map((_, idx) => (
              <li key={idx}>
                <Skeleton height={20} width={`80%`} />
              </li>
            ))}
          </ul>
        </div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <Skeleton height={20} width={`90%`} />
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 2 }).map((_, idx) => (
            <Skeleton key={idx} height={20} width={60} />
          ))}
        </div>
      </td>
      <td className="p-4 border-b border-blue-gray-50">
        <Skeleton circle height={20} width={20} />
      </td>
    </tr>
  );
};

export default SkeletonRow;
