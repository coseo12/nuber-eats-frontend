import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useLocation } from 'react-router-dom';
import { Pagination } from 'src/components/pagination';
import { Restaurant } from 'src/components/restaurant';
import { RestaurantConatainer } from 'src/components/restaurant-container';
import { RestaurantsContainer } from 'src/components/restaurants-container';
import { SearchContainer } from 'src/components/search-container';
import { SearchTag } from 'src/components/search-tag';
import {
  searchRestaurant,
  searchRestaurantVariables,
} from 'src/__generated__/searchRestaurant';
import { RESTAURANT_FRAGMENT } from '../../fragment';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const history = useHistory();
  const [callQuery, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const [_, query] = location.search.split('?term=');
    if (!query) {
      return history.replace('/');
    }
    callQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [history, location, callQuery]);
  console.log(loading, data, called);
  const onNextPageClick = () => setPage(current => current + 1);
  const onPrevPageClick = () => setPage(current => current - 1);

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <SearchContainer />
      {!loading && (
        <RestaurantsContainer>
          <SearchTag
            title={location.search.split('?term=')[1]}
            totalResults={data?.searchRestaurant.totalResults || 0}
          />
          <RestaurantConatainer>
            {data?.searchRestaurant.restaurants?.map(restaurant => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id.toString()}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </RestaurantConatainer>
          <Pagination
            page={page}
            totalPages={data?.searchRestaurant.totalPages || 0}
            onPrevPageClick={onPrevPageClick}
            onNextPageClick={onNextPageClick}
          />
        </RestaurantsContainer>
      )}
    </div>
  );
};
