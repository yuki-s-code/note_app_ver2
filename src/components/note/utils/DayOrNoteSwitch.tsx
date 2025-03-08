// TailwindSwitch.tsx
import React from "react";

export const DayOrNoteSwitch = ({ isChecked, setIsChecked }: any) => {
  const handleToggle = () => {
    setIsChecked(!isChecked);
    // ここにトグル時のロジックを追加できます
  };

  return (
    <div className="flex items-center">
      <label
        htmlFor="switchsample"
        className="flex items-center cursor-pointer select-none"
      >
        {/* Hidden checkbox */}
        <input
          type="checkbox"
          id="switchsample"
          name="switchsample"
          className="hidden peer"
          checked={isChecked}
          onChange={handleToggle}
        />
        {/* Switch Track */}
        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-gray-600 transition-colors duration-500 relative">
          {/* Switch Knob */}
          <span
            className={`absolute ${isChecked ? "left-0.5" : "right-0.5"} top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-500 peer-checked:translate-x-full`}
          ></span>
        </div>
      </label>
    </div>
  );
};
