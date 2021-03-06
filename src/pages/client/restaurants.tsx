import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { RestaurantsContainer } from 'src/components/restaurants-container';
import { CategoryContainer } from 'src/components/category-container';
import { CategoryItem } from 'src/components/category-item';
import { Pagination } from 'src/components/pagination';
import { Restaurant } from 'src/components/restaurant';
import { RestaurantConatainer } from 'src/components/restaurant-container';
import { SearchContainer } from 'src/components/search-container';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from 'src/fragment';
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from 'src/__generated__/restaurantsPageQuery';

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
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
  ${CATEGORY_FRAGMENT}
`;

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  const onNextPageClick = () => setPage(current => current + 1);
  const onPrevPageClick = () => setPage(current => current - 1);

  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <SearchContainer />
      {!loading && (
        <RestaurantsContainer>
          <CategoryContainer>
            {data?.allCategories.categories?.map(category => (
              <Link to={`/category/${category.slug}`} key={category.id}>
                <CategoryItem
                  coverImg={category.coverImg || ''}
                  name={category.name}
                />
              </Link>
            ))}
          </CategoryContainer>
          <RestaurantConatainer>
            {data?.restaurants.restaurants?.map(restaurant => (
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
            totalPages={data?.restaurants.totalPages || 0}
            onPrevPageClick={onPrevPageClick}
            onNextPageClick={onNextPageClick}
          />
        </RestaurantsContainer>
      )}
    </div>
  );
};
