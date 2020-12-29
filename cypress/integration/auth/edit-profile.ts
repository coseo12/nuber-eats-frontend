describe('Edit Profile', () => {
  const user = cy;
  beforeEach(() => {
    // @ts-ignore
    user.login('new@mail.com', '121212');
  });
  it('can go to /edit-profile using the header', () => {
    user.get('a[href="/edit-profile"]').click();
    user.title().should('eq', 'Edit Profile | Nuber Eats');
  });

  it('can change email', () => {
    user.intercept('POST', 'http://localhost:4000/graphql', req => {
      const { operationName } = req.body;
      if (operationName && operationName === 'editProfile') {
        // @ts-ignore
        req.body?.variables?.input?.email = 'new@mail.com';
        req.reply(res => {
          res.send({
            fixture: 'auth/edit-profile.json',
          });
        });
      }
    });
    user.visit('/edit-profile');
    user.findByPlaceholderText(/email/i).clear().type('new@mail.com');
    user.findByRole('button').click();
  });
});
