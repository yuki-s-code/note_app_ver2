import { useQueryGetUser } from "../../libs/hooks/loginHook/useQueryLogin";
import menProfileIcon from "../../assets/icons_men_user.png";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";
import { useAppDispatch, useAppSelector } from "../../libs/app/hooks";
import { selectLoginUser, setLoginUser } from "../../slices/userSlice";
import { memo } from "react";

const MyPage = memo(() => {
  const dispatch = useAppDispatch();
  const { status, data }: any = useQueryGetUser(window.localStorage.sns_id);
  const user: any = useAppSelector(selectLoginUser);
  console.log(data);

  const profileHandler = (e: any) => {
    e.preventDefault();
    dispatch(
      setLoginUser({
        ...user,
        userid: data.docs.userid,
        hash: data.docs.hash,
        token: data.docs.token,
        active: data.docs.active,
        profile: data.docs.profile,
        profiledetail: data.docs.profilededail,
        boardfollow: data.docs.boardfollow,
        notefollow: data.docs.notefollow,
      })
    );
  };

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;

  return (
    <div className="p-16 w-screen">
      <div className="p-8 bg-white shadow mt-24 w-10/12">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">89</p>
              <p className="text-gray-400">Comments</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <div className="absolute flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                <img
                  className="h-full w-full rounded-full"
                  src={menProfileIcon}
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Connect
            </button>
            <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Message
            </button>
          </div>
        </div>

        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">
            {window.localStorage.sns_id}{" "}
            <span className="font-light text-gray-500">2023</span>
          </h1>
          <p className="font-light text-gray-600 mt-3">日本</p>

          <p
            className="mt-8 text-gray-500"
            onClick={(e) => profileHandler(e)}
          >{`${
            data?.docs?.profile
              ? data?.docs?.profile
              : "プロフィールの概要を記載してください"
          }`}</p>
        </div>

        <div className="mt-12 flex flex-col justify-center">
          <p
            className="text-gray-600 text-center font-light lg:px-16"
            onClick={(e) => profileHandler(e)}
          >
            {`${
              data?.docs?.profiledetail
                ? data?.docs?.profiledetail
                : "プロフィールの詳細を記載してください"
            }`}
          </p>
        </div>
      </div>
    </div>
  );
});
export default MyPage;
