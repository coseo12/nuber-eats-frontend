import React from 'react';

interface ISerchTagProps {
  title: string;
  totalResults: number;
}

export const SearchTag: React.FC<ISerchTagProps> = ({
  title,
  totalResults,
}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="font-medium text-4xl">"{title}"</h2>
      <h4 className="font-light text-sm text-gray-400 ">
        Restaurants: {totalResults}
      </h4>
    </div>
  );
};
