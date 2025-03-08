import { FC } from "react";
import icon from "../../assets/ashiya_logo.jpg";

export const Logo: FC = () => {
  return (
    <div className="mb-8 flex justify-center">
      <img className="w-24" src={icon} alt="" />
    </div>
  );
};
