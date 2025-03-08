import { FC, memo } from "react";
import { Logo } from "../components/login/Logo";
import Main from "../components/login/Main";
import { Link } from "react-router-dom";

const Login: FC = memo(() => {
  console.log("login");
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="min-w-fit flex-col border bg-white px-6 py-14 shadow-md rounded-[4px]">
        <Logo />
        <Main />
        <div className="mt-5 flex text-center text-sm text-gray-400">
          <p>
            This site is NoteApp <br />
            <Link to="/sign" className="underline">
              Privacy Policy
            </Link>
            {" and "}
            <Link to="/sign" className="underline">
              Terms of Service
            </Link>
            {" apply."}
          </p>
        </div>
      </div>
    </div>
  );
});
export default Login;
