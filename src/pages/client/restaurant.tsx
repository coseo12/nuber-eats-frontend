import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Dish } from 'src/components/dish';
import { DishOption } from 'src/components/dish-option';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from 'src/fragment';
import {
  createOrder,
  createOrderVariables,
} from 'src/__generated__/createOrder';
import {
  CreateOrderItemInput,
  OrderItemOptionInputType,
} from 'src/__generated__/globalTypes';
import { restaurant, restaurantVariables } from 'src/__generated__/restaurant';

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

interface IOptions {
  name: string;
  extra: number;
}

interface IOrderList {
  dishId: number;
  name: string;
  options?: IOptions[];
  price: number;
}

export const Restaurant = () => {
  const history = useHistory();
  const params = useParams<IRestaurantParams>();
  const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +params.id,
      },
    },
  });
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<IOrderList[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const triggerStartOrder = () => {
    setOrderStarted(true);
  };
  const getItem = (dishId: number) => {
    return orderItems.find(order => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  const addItemToOrder = (dishId: number, price: number, name: string) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems(current => [
      { dishId, name, price, options: [] },
      ...current,
    ]);
  };
  const removeFromOrder = (dishID: number) => {
    setOrderItems(current => current.filter(dish => dish.dishId !== dishID));
  };
  const addOptionToItem = (
    dishId: number,
    optionName: string,
    extra: number
  ) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find(aOption => aOption.name === optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems(current => [
          {
            dishId,
            name: oldItem.name,
            price: oldItem.price,
            options: [{ name: optionName, extra }, ...oldItem.options!],
          },
          ...current,
        ]);
      }
    }
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems(current => [
        {
          dishId,
          name: oldItem.name,
          price: oldItem.price,
          options: oldItem.options?.filter(
            option => option.name !== optionName
          ),
        },
        ...current,
      ]);
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ): OrderItemOptionInputType | undefined => {
    return item.options?.find(option => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };
  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (ok) {
      setTimeout(() => {
        history.push(`/orders/${orderId}`);
      }, 1);
    }
  };
  const [createOrderMutation, { loading: placingORder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });
  const triggerConfirmOrder = () => {
    if (orderItems.length === 0) {
      alert(`Can't place empty order`);
      return;
    }
    const ok = window.confirm('You are about to place on order');
    if (ok) {
      const items = orderItems.map(orders => {
        let obj: any = {};
        obj.dishId = orders.dishId;
        obj.options = orders?.options?.map(order => ({ name: order.name }));
        return obj;
      });

      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items,
          },
        },
      });
    }
  };
  const triggerSetTotalPrice = (orderList: IOrderList[]) => {
    let total: number = 0;
    orderList.forEach(orders => {
      total = total + orders.price;
      orders.options?.forEach(option => {
        total = total + option.extra;
      });
    });
    setTotalPrice(total);
  };

  useEffect(() => {
    triggerSetTotalPrice(orderItems);
  }, [orderItems]);

  return (
    <div>
      <Helmet>
        <title>Restaurant | Nuber Eats</title>
      </Helmet>
      <div
        className="bg-gray-800 py-48 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-white w-3/4 lg:w-3/12 py-8 pl-48">
          <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <Link to={`/category/${data?.restaurant.restaurant?.category?.slug}`}>
            <h5 className="text-sm font-light mb-2 hover:underline">
              {data?.restaurant.restaurant?.category?.name}
            </h5>
          </Link>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="container pb-32 flex flex-col items-end mt-20">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-10">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
              Confirm Order
            </button>
            <button
              onClick={triggerCancelOrder}
              className="btn px-10 bg-black hover:bg-black"
            >
              Cancel Order
            </button>
          </div>
        )}
        <div className="grid grid-cols-3 w-full gap-x-5 gap-y-10">
          <div className="w-full col-span-2 grid mt-16 md:grid-cols-2 gap-x-5 gap-y-10">
            {data?.restaurant.restaurant?.menu.map((dish, idx) => (
              <Dish
                key={idx}
                isSelected={isSelected(dish.id)}
                id={dish.id}
                orderStarted={orderStarted}
                name={dish.name}
                price={dish.price}
                description={dish.description}
                isCustomer={true}
                options={dish.options}
                addItemToOrder={addItemToOrder}
                removeFromOrder={removeFromOrder}
              >
                {dish.options?.map((option, idx) => (
                  <DishOption
                    key={idx}
                    isSelected={isOptionSelected(dish.id, option.name)}
                    name={option.name}
                    extra={option.extra || 0}
                    addOptionToItem={addOptionToItem}
                    dishId={dish.id}
                    removeOptionFromItem={removeOptionFromItem}
                  />
                ))}
              </Dish>
            ))}
          </div>
          <div className="mt-16">
            {orderItems.length !== 0 &&
              orderItems.map((items, idx) => (
                <div key={idx}>
                  <div className="mt-1 flex items-center justify-between mx-5 border-b">
                    <h6 className="font-medium w-full">{items.name}:</h6>
                    <h6 className="text-xs opacity-75">${items.price}</h6>
                  </div>
                  {items.options?.map((option, idx) => (
                    <div
                      key={idx}
                      className="mt-1 flex items-center justify-between mx-5 border-b"
                    >
                      <h6 className="text-sm font-light w-full">
                        {option.name}:
                      </h6>
                      <h6 className="text-xs opacity-75">${option.extra}</h6>
                    </div>
                  ))}
                </div>
              ))}
            {orderItems.length !== 0 && (
              <div className="mt-1 flex items-center justify-between mx-5 border-b  text-lime-700">
                <h6 className="font-medium w-full">Total:</h6>
                <h6 className="text-xs opacity-75">${totalPrice}</h6>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
