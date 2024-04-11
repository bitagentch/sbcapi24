describe('api ping spec', () => {
  it('passes', () => {
    cy.request('/api/ping').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.response).to.eq('pong');
    });
  })
})