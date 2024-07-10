describe('Create a new room', () => {
  let roomId = '';

  it('shows validation errors when leaving fields blank', () => {
    cy.visit('create');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="error-message-name"]').should('exist');
    cy.get('[data-cy="error-message-room-key"]').should('exist');
    cy.get('[data-cy="error-message-question-responses"]').should('exist');
  });

  it('admin creates room, then opens it', () => {
    // admin creates room
    cy.visit('create');
    cy.get('[data-cy="input-message-name"]').type('Cypress');
    cy.get('[data-cy="input-room-key"]').type('testkey');
    // eslint-disable-next-line max-len
    cy.get('[data-cy="input-question-responses"]').type('[{"prompt":"What is the best class at Dartmouth?","answer":"CS52"},{"prompt":"What is the best programming language?","answer":"JavaScript"},{"prompt":"What is the answer to Life, the Universe, and Everything","answer":"42"},{"prompt":"Are there any  more questions?","answer":"no"}]', { parseSpecialCharSequences: false });
    cy.get('[data-cy="submit-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="room-title"]').should('exist');
    cy.get('[data-cy="room-your-name"]').should('have.text', 'Cypress');
    cy.get('[data-cy="room-open-room-button"]').should('exist');
    cy.get('[data-cy="room-start-game-button"]').should('not.exist');
    cy.get('[data-cy="room-id"]').then(($value) => {
      roomId = $value.text();
    });

    // admin opens room
    cy.get('[data-cy="room-input-admin-key"]').type('testkey');
    cy.get('[data-cy="room-open-room-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="room-open-room-button"]').should('not.exist');
    cy.get('[data-cy="room-start-game-button"]').should('exist');
  });

  it('Alice joins the game', () => {
    cy.visit(`/join?room=${roomId}`);
    cy.get('[data-cy="join-game-code-input-disabled"]').should('exist');
    cy.get('[data-cy="join-game-code-input"]').should('not.exist');
    cy.get('[data-cy="join-game-name-input"]').type('Alice');
    cy.get('[data-cy="submit-button"]').click();
    cy.wait(1000);

    cy.get('[data-cy="room-title"]').should('exist');
    cy.get('[data-cy="room-your-name"]').should('have.text', 'Alice');
    cy.get('[data-cy="room-open-room-button"]').should('not.exist');
    cy.get('[data-cy="room-start-game-button"]').should('not.exist');
    cy.get('[data-cy="room-id"]').should('have.text', roomId);
    cy.get('[data-cy="player-entry-Alice').should('have.text', 'Alice');
  });

  it('Bob joins the game', () => {
    cy.visit(`/join?room=${roomId}`);
    cy.get('[data-cy="join-game-code-input-disabled"]').should('exist');
    cy.get('[data-cy="join-game-code-input"]').should('not.exist');
    cy.get('[data-cy="join-game-name-input"]').type('Bob');
    cy.get('[data-cy="submit-button"]').click();
    cy.wait(1000);

    cy.get('[data-cy="room-title"]').should('exist');
    cy.get('[data-cy="room-your-name"]').should('have.text', 'Bob');
    cy.get('[data-cy="room-open-room-button"]').should('not.exist');
    cy.get('[data-cy="room-start-game-button"]').should('not.exist');
    cy.get('[data-cy="room-id"]').should('have.text', roomId);
    cy.get('[data-cy="player-entry-Alice').should('have.text', 'Alice');
    cy.get('[data-cy="player-entry-Bob').should('have.text', 'Bob');
  });

  it('admin joins, starts, and plays the game', () => {
    // admin joins
    cy.visit(`/join?room=${roomId}`);
    cy.get('[data-cy="join-game-code-input-disabled"]').should('exist');
    cy.get('[data-cy="join-game-code-input"]').should('not.exist');
    cy.get('[data-cy="join-game-name-input"]').type('Cypress');
    cy.get('[data-cy="submit-button"]').click();
    cy.wait(1000);

    cy.get('[data-cy="room-title"]').should('exist');
    cy.get('[data-cy="room-your-name"]').should('have.text', 'Cypress');
    cy.get('[data-cy="room-open-room-button"]').should('not.exist');
    cy.get('[data-cy="room-start-game-button"]').should('exist');
    cy.get('[data-cy="room-id"]').should('have.text', roomId);
    cy.get('[data-cy="player-entry-Alice').should('have.text', 'Alice');
    cy.get('[data-cy="player-entry-Bob').should('have.text', 'Bob');
    cy.get('[data-cy="player-entry-Cypress').should('have.text', 'Cypress');

    // admin starts game
    cy.get('[data-cy="room-input-admin-key"]').type('testkey');
    cy.get('[data-cy="room-start-game-button"]').click();
    cy.wait(1000);

    cy.get('[data-cy="question-heading"]').should('have.text', 'Question #1: What is the best class at Dartmouth?');
    cy.get('[data-cy="force-answers-button"]').should('exist');

    // admin submits answer to first question (incorrect)
    cy.get('[data-cy="question-answer-input"]').type('Not CS52');
    cy.get('[data-cy="submit-button"]').click();
    cy.wait(1000);

    cy.get('[data-cy="question-result"]').should('have.text', 'Incorrect');
  });
});
