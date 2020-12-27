import React from 'react';

interface IPaginationProps {
  page: number;
  totalPages: number;
  onPrevPageClick(): void;
  onNextPageClick(): void;
}

export const Pagination: React.FC<IPaginationProps> = ({
  page,
  onPrevPageClick,
  onNextPageClick,
  totalPages,
}) => {
  return (
    <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto my-10">
      {page > 1 ? (
        <button
          className="focus:outline-none font-medium text-2xl"
          onClick={onPrevPageClick}
        >
          &larr;
        </button>
      ) : (
        <div></div>
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page !== totalPages ? (
        <button
          className="focus:outline-none font-medium text-2xl"
          onClick={onNextPageClick}
        >
          &rarr;
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};
