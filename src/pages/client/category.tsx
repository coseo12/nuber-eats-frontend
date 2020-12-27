import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Pagination } from 'src/components/pagination';
import { Restaurant } from 'src/components/restaurant';
import { RestaurantConatainer } from 'src/components/restaurant-container';
import { RestaurantsContainer } from 'src/components/restaurants-container';
import { SearchContainer } from 'src/components/search-container';
import { SearchTag } from 'src/components/search-tag';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from 'src/fragment';
import { category, categoryVariables } from 'src/__generated__/category';

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const [page, setPage] = useState(1);
  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page,
          slug: params.slug,
        },
      },
    }
  );
  const onNextPageClick = () => setPage(current => current + 1);
  const onPrevPageClick = () => setPage(current => current - 1);

  return (
    <div>
      <Helmet>
        <title>Category | Nuber Eats</title>
      </Helmet>
      <SearchContainer />
      {!loading && (
        <RestaurantsContainer>
          <SearchTag
            title={params.slug}
            totalResults={data?.category.totalResults || 0}
          />
          <RestaurantConatainer>
            {data?.category.restaurants?.map(restaurant => (
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
            totalPages={data?.category.totalPages || 0}
            onPrevPageClick={onPrevPageClick}
            onNextPageClick={onNextPageClick}
          />
        </RestaurantsContainer>
      )}
    </div>
  );
};
