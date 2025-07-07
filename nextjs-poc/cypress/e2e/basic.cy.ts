describe('Homepage', () => {
  it('loads top stories', () => {
    cy.visit('/');
    cy.contains('Top Stories');
  });
}); 