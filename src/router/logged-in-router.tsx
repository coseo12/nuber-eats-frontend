import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useMe } from 'src/hooks/useMe';
import { NotFound } from 'src/pages/404';
import { Category } from 'src/pages/client/category';
import { Restaurant } from 'src/pages/client/restaurant';
import { Restaurants } from 'src/pages/client/restaurants';
import { Search } from 'src/pages/client/search';
import { ConfirmEmail } from 'src/pages/user/confirm-email';
import { EditProfile } from 'src/pages/user/edit-profile';
import { Header } from '../components/header';

const ClientRouter = [
  <Route path="/" exact key={1}>
    <Restaurants />
  </Route>,
  <Route path="/confirm" key={2}>
    <ConfirmEmail />
  </Route>,
  <Route path="/edit-profile" key={3}>
    <EditProfile />
  </Route>,
  <Route path="/search" key={4}>
    <Search />
  </Route>,
  <Route path="/category/:slug" key={5}>
    <Category />
  </Route>,
  <Route path="/restaurant/:id" key={6}>
    <Restaurant />
  </Route>,
];

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
        {data.me.role === 'Client' && ClientRouter}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
