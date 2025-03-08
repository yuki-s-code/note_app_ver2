import { ipcRenderer } from "electron"; // ElectronのipcRendererをimportする
import { memo } from "react";
import { Link } from "react-router-dom";

const Secondary = memo(() => {
  const openSecondaryWindow = () => {
    ipcRenderer.send("open-secondary-window");
  };

  return (
    <button
      className="absolute -mt-10 p-2 ml-4 bg-gray-200 text-gray-600 text-xs opacity-50 hover:opacity-80 rounded-lg"
      onClick={openSecondaryWindow}
    >
      新規ウィンドウ
      <Link to="/secondary"></Link>
    </button>
  );
});
export default Secondary;
