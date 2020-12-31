import React from 'react';

interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  extra?: number;
  dishId: number;
  addOptionToItem: (dishId: number, optionName: string, extra: number) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra = 0,
  dishId,
  addOptionToItem,
  removeOptionFromItem,
}) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name, extra);
    }
  };

  return (
    <span
      onClick={onClick}
      className={`flex border px-2 py-1 ${
        isSelected ? 'border-gray-900' : 'hover:border-gray-400'
      }`}
    >
      <h6 className="mr-2">{name}</h6>
      {<h6 className="text-sm opacity-75">(${extra})</h6>}
    </span>
  );
};
