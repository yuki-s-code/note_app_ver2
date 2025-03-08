import { FC } from "react";

type HomeProps = {
  children: React.ReactNode;
};

const Home: FC<HomeProps> = ({ children }) => {
  return (
    <li className="text-white p-4 w-full flex shadow-sm justify-start bg-gray-800 border-b-2 border-gray-700">
      <div className="mr-4 flex-shrink-0 my-auto">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </div>
      <div className="flex-auto my-1">
        <span>{children}</span>
      </div>
    </li>
  );
};
export default Home;
