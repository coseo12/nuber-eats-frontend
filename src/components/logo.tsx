import React from 'react';
import nuberLogo from '../images/eats-logo.svg';

interface ILogoProps {
  className: string;
}

export const Logo: React.FC<ILogoProps> = ({ className }) => (
  <img src={nuberLogo} alt={`Logo`} className={className} />
);
