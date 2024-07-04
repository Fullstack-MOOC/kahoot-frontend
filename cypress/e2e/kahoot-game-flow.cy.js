describe('Create a new room', () => {
  it('Shows validation errors when leaving fields blank', () => {
    cy.visit('https://localhost:5173/create');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="error-message-name"]').should('exist');
    cy.get('[data-cy="error-message-room-key"]').should('exist');
    cy.get('[data-cy="error-message-question-responses"]').should('exist');
  })
})