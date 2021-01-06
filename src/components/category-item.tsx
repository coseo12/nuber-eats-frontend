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
        style={{ backgroundImage: `url(${coverImg ? coverImg : 'https://images.unsplash.com/photo-1559941727-6fb446e7e8ae?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2250&q=80'})` }}
      ></div>
      <span className="mt-1 text-sm text-center font-medium uppercase">
        {name}
      </span>
    </div>
  );
};
