import { useQueryAllBoardHashtag } from "@/libs/hooks/boardHook/useQueryBoard";
import { Error } from "../atoms/fetch/Error";
import { Loding } from "../atoms/fetch/Loding";

const TagTop = () => {
  const { data, status }: any = useQueryAllBoardHashtag();

  const countHashtags = (dataArray: any) => {
    const hashtagCounts: any = {};
    dataArray.forEach((item: any) => {
      if (item.contents && item.contents.root) {
        traverseAndCountHashtags(item.contents.root, (hashtag: any) => {
          hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
        });
      }
    });
    return hashtagCounts;
  };
  // ツリー構造を再帰的に走査し、ハッシュタグを数える関数
  const traverseAndCountHashtags = (node: any, callback: any) => {
    if (node.children) {
      node.children.forEach((child: any) => {
        if (child.type === "hashtag" && child.text) {
          callback(child.text.trim());
        }
        traverseAndCountHashtags(child, callback);
      });
    }
  };
  const hashtagCounts = countHashtags(data?.docs);

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;
  return (
    <ul>
      {Object.entries(hashtagCounts).map(([hashtag, count]) => (
        <li key={hashtag} className=" mt-6">
          <span className=" p-2 bg-blue-100 rounded-2xl">{`${hashtag}: ${count}`}</span>
        </li>
      ))}
    </ul>
  );
};
export default TagTop;
