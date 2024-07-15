import { cn } from "@/utils/utils";
import React from "react";

const MarketingBlock = (params) => {
  const { left, right, className } = params;
  return (
    <>
      <div className={cn(
        " container grid md:grid-cols-2 grid-cols-1 items-center justify-center px-2 md:px-0 sm:py-10 md:py-20",
        className
      )}>
        <div className="px-10 mx-auto">{left}</div>
        <div className="px-10 mx-auto">{right}</div>
      </div>
    </>
  );
};

export default MarketingBlock;
