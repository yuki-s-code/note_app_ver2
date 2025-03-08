//Friend.tsx

import { memo } from "react";
import menProfileIcon from "../../assets/icons_men_user.png";

const Friend = memo(() => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5 w-4/5">
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-4 font-medium text-gray-900">
              名前
            </th>
            <th scope="col" className="px-4 py-4 font-medium text-gray-900">
              状態
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          <tr className="hover:bg-gray-50">
            <th className="flex gap-3 px-4 py-4 font-normal text-gray-900">
              <div className="relative h-10 w-10">
                <img
                  className="h-full w-full rounded-full object-cover object-center"
                  src={menProfileIcon}
                  alt=""
                />
                <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-700">Steven Jobs</div>
              </div>
            </th>
            <td className="px-4 py-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                Active
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default Friend;
