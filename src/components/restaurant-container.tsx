import React from 'react';

export const RestaurantConatainer: React.FC = ({ children }) => {
  return (
    <div className="mt-16 grid md:grid-cols-3 gap-x-5 gap-y-10">{children}</div>
  );
};
