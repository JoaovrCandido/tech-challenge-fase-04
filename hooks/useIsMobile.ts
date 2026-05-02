import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => window.innerWidth < breakpoint;

    setIsMobile(checkMobile());
    window.addEventListener("resize", () => setIsMobile(checkMobile()));

    return () => {
      window.removeEventListener("resize", () => setIsMobile(checkMobile()));
    };
  }, [breakpoint]);

  return isMobile;
}
