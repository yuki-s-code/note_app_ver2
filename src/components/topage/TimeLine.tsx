import { FC, memo, useEffect } from "react";
import { useQueryAllBoard } from "../../libs/hooks/boardHook/useQueryBoard";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";
import TimeLimeItem from "./TimeLineItem";
import { useAppDispatch } from "../../libs/app/hooks";
import { setNav } from "../../slices/navSlice";

const TimeLine: FC = memo(() => {
  const { data, status, refetch }: any = useQueryAllBoard(10);

  const dispatch = useAppDispatch();

  const openNav = (i: string) => {
    dispatch(setNav({ name: i }));
  };

  useEffect(() => {
    refetch();
  }, [data]);

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;
  return (
    <div
      className="flex-1 bg-white rounded-lg shadow-xl mt-4 p-8"
      role="button"
      tabIndex={0}
      onClick={() => openNav("board")}
      onKeyDown={() => openNav("board")}
    >
      <h4 className="text-xl text-gray-900 font-bold">最新</h4>
      <div className="relative px-4 overflow-auto h-96">
        <div className="absolute h-screen border border-dashed border-opacity-20 border-secondary"></div>
        <div className="flex text-gray-700">
          <div className="flex flex-col flex-grow">
            {data?.docs?.map((d: any, i: any) => (
              <TimeLimeItem key={i} item={d} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
export default TimeLine;
