import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { useMe } from 'src/hooks/useMe';
import { Logo } from './logo';

export const Header = () => {
  const { data } = useMe();

  return (
    <header className="py-4">
      <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
        <Logo className="w-24" />
        <span className="text-xs">
          <Link to="/my-profile">
            <FontAwesomeIcon icon={faUser} className="text-xl" />
          </Link>
        </span>
      </div>
    </header>
  );
};
