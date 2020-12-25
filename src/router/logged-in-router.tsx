import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useMe } from 'src/hooks/useMe';
import { NotFound } from 'src/pages/404';
import { Restaurants } from 'src/pages/client/restaurants';
import { Header } from '../components/header';

const ClientRouter = [
  <Route path="/" exact key="/">
    <Restaurants />
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
        <NotFound />
      </Switch>
    </Router>
  );
};
