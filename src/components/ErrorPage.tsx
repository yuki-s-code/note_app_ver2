import { Link } from "react-router-dom";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  return (
    <>
      <div className=" text-9xl">Oops</div>
      <Link to={"/"}>戻る</Link>
    </>
  );
}
