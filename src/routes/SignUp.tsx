import { FC, memo } from "react";
import { Logo } from "../components/login/Logo";
import UserCreate from "../components/login/UserCreate";

const SignUp: FC = memo(() => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="min-w-fit flex-col border bg-white px-6 py-14 shadow-md rounded-[4px]">
        <div className="ml-8 mb-8 text-3xl text-red-600">ユーザー新規作成</div>
        <Logo />
        <UserCreate />
        <div className="mt-5 flex text-center text-sm text-gray-400">
          <p>
            This site is NoteApp <br />
            <a className="underline" href="Login.tsx">
              Privacy Policy
            </a>
            {" and "}
            <a className="underline" href="Login.tsx">
              Terms of Service
            </a>
            {" apply."}
          </p>
        </div>
      </div>
    </div>
  );
});
export default SignUp;
