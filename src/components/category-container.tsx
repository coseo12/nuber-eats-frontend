import React from 'react';

export const CategoryContainer: React.FC = ({ children }) => {
  return (
    <div className="flex justify-around max-w-screen-xs mx-auto">
      {children}
    </div>
  );
};
