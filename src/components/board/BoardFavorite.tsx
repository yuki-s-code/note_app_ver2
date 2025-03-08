import { FC, useEffect, useState } from "react";
import BoardItem from "./BoardItem";
import { useQueryBoardFavorite } from "../../libs/hooks/boardHook/useQueryBoard";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";

const BoardFavorite: FC = () => {
  const [page, setPage] = useState(20);
  const { data, status, refetch }: any = useQueryBoardFavorite(
    page,
    window.localStorage.sns_id
  );

  console.log(data?.docs);

  useEffect(() => {
    refetch();
  }, [data, page]);

  const pageNation = () => {
    setPage(page + 10);
  };

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;

  return (
    <>
      <div className="flex text-gray-700">
        <div className="flex flex-col flex-grow">
          {data?.docs?.map((d: any, i: any) => (
            <BoardItem key={i} item={d} />
          ))}
        </div>
      </div>
      <div className="my-4 flex justify-center" onClick={() => pageNation()}>
        <div className="p-2 rounded hover:bg-gray-300 hover:text-white cursor-pointer text-sm text-blue-300">
          さらに表示
        </div>
      </div>
    </>
  );
};

export default BoardFavorite;
