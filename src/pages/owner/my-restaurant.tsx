import { gql, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Dish } from 'src/components/dish';
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from 'src/fragment';
import {
  myRestaurant,
  myRestaurantVariables,
} from 'src/__generated__/myRestaurant';
import { pendingOrders } from 'src/__generated__/pendingOrders';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory';

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

export const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  const { data: subscriptionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION
  );
  const history = useHistory();

  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      setTimeout(() => {
        history.push(`/orders/${subscriptionData.pendingOrders.id}`);
      });
    }
  });

  return (
    <div>
      <Helmet>
        <title>My Restaurant | Nuber Eats</title>
      </Helmet>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || 'Loading...'}
        </h2>
        <Link
          to={`/restaurant/${id}/add-dish`}
          className="mr-8 text-white bg-gray-800 py-3 px-10"
        >
          Add Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
      </div>
      <div className="container mt-10">
        {data?.myRestaurant.restaurant?.menu.length === 0 ? (
          <h4 className="text-lx mb-5">Please upload a dish!</h4>
        ) : (
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.myRestaurant.restaurant?.menu.map((dish, idx) => (
              <Dish
                key={idx}
                name={dish.name}
                price={dish.price}
                description={dish.description}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-20 mb-10">
        <h4 className="text-center text-2xl font-medium">Sales</h4>
        <div className="mt-10">
          <VictoryChart
            width={window.innerWidth}
            theme={VictoryTheme.material}
            height={500}
            domainPadding={50}
            containerComponent={<VictoryVoronoiContainer />}
          >
            <VictoryLine
              labels={({ datum }) => `$${datum.y}`}
              labelComponent={
                <VictoryLabel
                  style={{ fontSize: 14 }}
                  renderInPortal
                  dy={-25}
                />
              }
              data={data?.myRestaurant.restaurant?.orders.map(order => ({
                x: order.createdAt,
                y: order.total,
              }))}
              interpolation="natural"
              style={{
                data: {
                  strokeWidth: 3,
                },
              }}
            />
            <VictoryAxis
              style={
                { tickLabels: { fontSize: 15, fill: '#4D7C0F' } as any } as any
              }
              dependentAxis
              tickFormat={tick => `$${tick}`}
            />
            <VictoryAxis
              tickLabelComponent={<VictoryLabel renderInPortal />}
              style={{ tickLabels: { fontSize: 13 } as any } as any}
              tickFormat={tick => `${new Date(tick).toLocaleDateString('ko')}`}
            />
          </VictoryChart>
        </div>
      </div>
    </div>
  );
};
