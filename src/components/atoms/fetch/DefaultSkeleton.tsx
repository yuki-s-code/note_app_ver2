import { SkeletonLine } from "./SkeletonLine";

export function DefaultSkeleton() {
  const lines = Array.from({ length: 15 });

  return (
    <div className="max-w-full animate-pulse mt-14">
      <div className="flex">
        {/* SVGコンポーネント */}
        <div className=" mb-10 ml-2 h-10 w-8/12 rounded-full bg-gray-300">
          &nbsp;
        </div>
      </div>
      <div className="ml-12">
        {lines.map((_, index) => (
          <SkeletonLine key={index} />
        ))}
      </div>
    </div>
  );
}
