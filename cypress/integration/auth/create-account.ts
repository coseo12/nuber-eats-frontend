describe('Create Account', () => {
  const user = cy;
  it('should see email / password validation errors', () => {
    user.visit('/');
    user.findByText(/create an account/i).click();
    user.findAllByPlaceholderText(/email/i).type('non@good');
    user.findByRole('alert').should('have.text', 'Please enter a valid email');
    user.findAllByPlaceholderText(/email/i).clear();
    user.findByRole('alert').should('have.text', 'Email is required');
    user.findAllByPlaceholderText(/email/i).type('non@good.com');
    user
      .findAllByPlaceholderText(/password/i)
      .type('12')
      .clear();
    user.findByRole('alert').should('have.text', 'Password is required');
  });

  it('should be able to create account and login', () => {
    user.intercept('http://localhost:4000/graphql', req => {
      const { operationName } = req.body;
      if (operationName && operationName === 'createAccountMutation') {
        req.reply(res => {
          res.send({
            fixture: 'auth/create-account.json',
          });
        });
      }
    });
    user.visit('/create-account');
    user.findAllByPlaceholderText(/email/i).type('Client@nuber.com');
    user.findAllByPlaceholderText(/password/i).type('121212');
    user.findByRole('button').click();
    user.wait(1000);
    // @ts-ignore
    user.login('Client@nuber.com', '121212');
  });
});
