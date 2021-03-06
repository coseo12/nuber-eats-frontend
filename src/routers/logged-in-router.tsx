import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useMe } from 'src/hooks/useMe';
import { NotFound } from 'src/pages/404';
import { Category } from 'src/pages/client/category';
import { Restaurant } from 'src/pages/client/restaurant';
import { Restaurants } from 'src/pages/client/restaurants';
import { Search } from 'src/pages/client/search';
import { Dashboard } from 'src/pages/driver/dashboard';
import { Order } from 'src/pages/order';
import { AddDish } from 'src/pages/owner/add-dish';
import { AddRestaurant } from 'src/pages/owner/add-restaurant';
import { MyRestaurant } from 'src/pages/owner/my-restaurant';
import { MyRestaurants } from 'src/pages/owner/my-restaurants';
import { ConfirmEmail } from 'src/pages/user/confirm-email';
import { EditProfile } from 'src/pages/user/edit-profile';
import { UserRole } from 'src/__generated__/globalTypes';
import { Header } from '../components/header';

const commonRoutes = [
  { path: '/confirm', component: <ConfirmEmail /> },
  { path: '/edit-profile', component: <EditProfile /> },
  { path: '/orders/:id', component: <Order /> },
];
const clientRoutes = [
  { path: '/', component: <Restaurants /> },
  { path: '/search', component: <Search /> },
  { path: '/category/:slug', component: <Category /> },
  { path: '/restaurant/:id', component: <Restaurant /> },
];
const restaurantRoutes = [
  { path: '/', component: <MyRestaurants /> },
  { path: '/add-restaurant', component: <AddRestaurant /> },
  { path: '/restaurant/:id', component: <MyRestaurant /> },
  { path: '/restaurant/:restaurantId/add-dish', component: <AddDish /> },
];
const driverRoutes = [{ path: '/', component: <Dashboard /> }];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === UserRole.Client &&
          clientRoutes.map(route => (
            <Route key={route.path} exact path={route.path}>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Owner &&
          restaurantRoutes.map(route => (
            <Route key={route.path} exact path={route.path}>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Delivery &&
          driverRoutes.map(route => (
            <Route key={route.path} exact path={route.path}>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map(route => (
          <Route key={route.path} exact path={route.path}>
            {route.component}
          </Route>
        ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
