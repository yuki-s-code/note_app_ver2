//Footer.tsx

import { Typography } from "@material-tailwind/react";
import { memo } from "react";
import MainLogo from "../../assets/ashiya_logo.jpg";

export const Footer = memo(() => {
  return (
    <footer className="w-full bg-white p-8">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white text-center md:justify-between">
        <img src={MainLogo} alt="logo-ct" className="w-10" />
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Typography
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              開発者について
            </Typography>
          </li>
          <li>
            <Typography
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              ライセンス
            </Typography>
          </li>
          <li>
            <Typography
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              開発者に連絡
            </Typography>
          </li>
        </ul>
      </div>
      <hr className="my-8 border-blue-gray-50" />
      <Typography
        placeholder="true"
        onPointerEnterCapture
        onPointerLeaveCapture
        color="blue-gray"
        className="text-center font-normal"
      >
        &copy; 2023 Ashiya.com
      </Typography>
    </footer>
  );
});
