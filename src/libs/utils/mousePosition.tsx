import { useEffect, useState } from "react";

export const useMousePosition = (interval = 0) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let lastCalled: any;

    const handleMouseMove = (event: any) => {
      const currentTime = performance.now();
      if (lastCalled && currentTime - lastCalled < interval) {
        return;
      }

      setPosition({ x: event.pageX, y: event.pageY });
      lastCalled = currentTime;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [interval, setPosition]);

  return position;
};
