import React from 'react';

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

export const Driver: React.FC<IDriverProps> = () => {
  return <div className="text-lg">🚖</div>;
};
