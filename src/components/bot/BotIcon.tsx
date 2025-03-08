import React from "react";
import "./IconStyle.css"; // 外部CSSファイルをインポート

export const BotIcon = () => {
  return (
    <div>
      <div id="ui">
        <div className="crystal">
          <div className="crystal_panel top front"></div>
          <div className="crystal_panel top back"></div>
          <div className="crystal_panel top left"></div>
          <div className="crystal_panel top right"></div>
          <div className="crystal_panel bottom front"></div>
          <div className="crystal_panel bottom back"></div>
          <div className="crystal_panel bottom left"></div>
          <div className="crystal_panel bottom right"></div>
        </div>
      </div>
    </div>
  );
};
