describe('Create a new room', () => {
  let roomId = '';

  it('shows validation errors when leaving fields blank', () => {
    cy.visit('create');
    cy.get('[aria-label="submit-button"]').click();
    cy.get('[aria-label="error-message-name"]').should('exist');
    cy.get('[aria-label="error-message-room-key"]').should('exist');
    cy.get('[aria-label="error-message-question-responses"]').should('exist');
  });

  it('admin creates room, then opens it', () => {
    // admin creates room
    cy.visit('create');
    cy.get('[aria-label="input-message-name"]').type('Cypress');
    cy.get('[aria-label="input-room-key"]').type('testkey');
    // eslint-disable-next-line max-len
    cy.get('[aria-label="input-question-responses"]').type('[{"prompt":"What is the best class at Dartmouth?","answer":"CS52"},{"prompt":"What is the best programming language?","answer":"JavaScript"},{"prompt":"What is the answer to Life, the Universe, and Everything","answer":"42"},{"prompt":"Are there any  more questions?","answer":"no"}]', { parseSpecialCharSequences: false });
    cy.get('[aria-label="submit-button"]').click();
    cy.wait(1000);
    cy.get('[aria-label="room-title"]').should('exist');
    cy.get('[aria-label="room-your-name"]').should('have.text', 'Cypress');
    cy.get('[aria-label="room-open-room-button"]').should('exist');
    cy.get('[aria-label="room-start-game-button"]').should('not.exist');
    cy.get('[aria-label="room-id"]').then(($value) => {
      roomId = $value.text();
    });

    // admin opens room
    cy.get('[aria-label="room-input-admin-key"]').type('testkey');
    cy.get('[aria-label="room-open-room-button"]').click();
    cy.wait(1000);
    cy.get('[aria-label="room-open-room-button"]').should('not.exist');
    cy.get('[aria-label="room-start-game-button"]').should('exist');
  });

  it('Alice joins the game', () => {
    cy.visit(`/join?room=${roomId}`);
    cy.get('[aria-label="join-game-code-input-disabled"]').should('exist');
    cy.get('[aria-label="join-game-code-input"]').should('not.exist');
    cy.get('[aria-label="join-game-name-input"]').type('Alice');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait(1000);

    cy.get('[aria-label="room-title"]').should('exist');
    cy.get('[aria-label="room-your-name"]').should('have.text', 'Alice');
    cy.get('[aria-label="room-open-room-button"]').should('not.exist');
    cy.get('[aria-label="room-start-game-button"]').should('not.exist');
    cy.get('[aria-label="room-id"]').should('have.text', roomId);
    cy.get('[aria-label="player-entry-Alice').should('have.text', 'Alice');
  });

  it('Bob joins the game', () => {
    cy.visit(`/join?room=${roomId}`);
    cy.get('[aria-label="join-game-code-input-disabled"]').should('exist');
    cy.get('[aria-label="join-game-code-input"]').should('not.exist');
    cy.get('[aria-label="join-game-name-input"]').type('Bob');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait(1000);

    cy.get('[aria-label="room-title"]').should('exist');
    cy.get('[aria-label="room-your-name"]').should('have.text', 'Bob');
    cy.get('[aria-label="room-open-room-button"]').should('not.exist');
    cy.get('[aria-label="room-start-game-button"]').should('not.exist');
    cy.get('[aria-label="room-id"]').should('have.text', roomId);
    cy.get('[aria-label="player-entry-Alice').should('have.text', 'Alice');
    cy.get('[aria-label="player-entry-Bob').should('have.text', 'Bob');
  });

  it('admin joins, starts, and plays the game', () => {
    // admin joins
    cy.visit(`/join?room=${roomId}`);
    cy.get('[aria-label="join-game-code-input-disabled"]').should('exist');
    cy.get('[aria-label="join-game-code-input"]').should('not.exist');
    cy.get('[aria-label="join-game-name-input"]').type('Cypress');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait(1000);

    cy.get('[aria-label="room-title"]').should('exist');
    cy.get('[aria-label="room-your-name"]').should('have.text', 'Cypress');
    cy.get('[aria-label="room-open-room-button"]').should('not.exist');
    cy.get('[aria-label="room-start-game-button"]').should('exist');
    cy.get('[aria-label="room-id"]').should('have.text', roomId);
    cy.get('[aria-label="player-entry-Alice').should('have.text', 'Alice');
    cy.get('[aria-label="player-entry-Bob').should('have.text', 'Bob');
    cy.get('[aria-label="player-entry-Cypress').should('have.text', 'Cypress');

    // admin starts game
    cy.get('[aria-label="room-input-admin-key"]').type('testkey');
    cy.get('[aria-label="room-start-game-button"]').click();
    cy.wait(1000);

    cy.get('[aria-label="question-heading"]').should('have.text', 'Question #1: What is the best class at Dartmouth?');
    cy.get('[aria-label="force-answers-button"]').should('exist');

    // admin submits answer to first question (incorrect)
    cy.get('[aria-label="question-answer-input"]').type('Not CS52');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait(1000);

    cy.get('[aria-label="question-result"]').should('have.text', 'Incorrect');

    // TODO: example of .find
    // TODO: example of cy.intercept https://stackoverflow.com/questions/71448296/cypress-get-object-return-after-click
  });
});
