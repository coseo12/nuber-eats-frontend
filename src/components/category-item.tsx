import React from 'react';

interface ICategoryItemProps {
  coverImg: string;
  name: string;
}

export const CategoryItem: React.FC<ICategoryItemProps> = ({
  coverImg,
  name,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 bg-cover  rounded-full"
        style={{ backgroundImage: `url(${coverImg})` }}
      ></div>
      <span className="mt-1 text-sm text-center font-medium capitalize">
        {name}
      </span>
    </div>
  );
};
