import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Restaurant } from 'src/components/restaurant';
import { RestaurantConatainer } from 'src/components/restaurant-container';
import { RESTAURANT_FRAGMENT } from 'src/fragment';
import { myRestaurants } from 'src/__generated__/myRestaurants';

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="max-w-screen-2xl mx-auto mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        <Link className="text-lime-600 hover:underline" to="/add-restaurant">
          Create one &rarr;
        </Link>
        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants?.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link
              className="text-lime-600 hover:underline"
              to="/add-restaurant"
            >
              Create one &rarr;
            </Link>
          </>
        ) : (
          <>
            <RestaurantConatainer>
              {data?.myRestaurants.restaurants?.map(restaurant => (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id?.toString()}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              ))}
            </RestaurantConatainer>
          </>
        )}
      </div>
    </div>
  );
};
