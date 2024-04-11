describe('app home spec', () => {
  it('passes', () => {
    cy.visit('/');
    cy.get('[data-testid="title"]').should('contain', 'LnPay');
  })
})