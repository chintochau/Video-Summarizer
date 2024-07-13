import React from "react";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/utils";

const MarketingHero = (params) => {
  const { title, description, image, button, action, path, className } = params;

  return (
    <div className={
      cn("w-full", className)
    }>
      <div
        className="container flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      >
        <h1 className="text-5xl font-semibold text-black/80">{title}</h1>
        <p className="text-2xl text-gray-500 font-light text-center py-8">
          {description}
        </p>
        <Link to={path}>
          <Button className="py-8 text-lg" size="lg">
            {button}
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MarketingHero;
