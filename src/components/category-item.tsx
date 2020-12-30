import React from 'react';

interface ICategoryItemProps {
  coverImg: string;
  name: string;
  opacity?: number;
}

export const CategoryItem: React.FC<ICategoryItemProps> = ({
  coverImg,
  name,
  opacity,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-16 h-16 bg-cover rounded-full opacity-${
          opacity ? opacity : 100
        }`}
        style={{ backgroundImage: `url(${coverImg})` }}
      ></div>
      <span className="mt-1 text-sm text-center font-medium uppercase">
        {name}
      </span>
    </div>
  );
};
