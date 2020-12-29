describe('Login', () => {
  const user = cy;
  it('should go to homepage', () => {
    user.visit('/').title().should('eq', 'Login | Nuber Eats');
  });

  it('can see email / passwrod validation errors', () => {
    user.visit('/');
    user.findByPlaceholderText(/email/i).type('Client@nuber');
    user.findByRole('alert').should('have.text', 'Please enter a valid email');
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole('alert').should('have.text', 'Email is required');
    user.findByPlaceholderText(/email/i).type('Client@nuber.com');
    user
      .findByPlaceholderText(/password/i)
      .type('1212')
      .clear();
  });

  it('can fill out the form an login', () => {
    // @ts-ignore
    user.login('Client@nuber.com', '121212');
  });
});
