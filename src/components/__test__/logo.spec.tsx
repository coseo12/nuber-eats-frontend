import { render } from '@testing-library/react';
import React from 'react';
import { Logo } from '../logo';

describe('<Logo />', () => {
  it('should render OK with props', () => {
    const { container } = render(<Logo className={`test`} />);
    expect(container.firstChild).toHaveClass('test');
  });
});
