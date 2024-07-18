let roomId = '';

describe('Creating and opening a game with questions and answers', () => {
  it('shows validation errors when leaving fields blank', () => {
    // TODO
  });

  it('admin creates room, then opens it', () => {
    // This one has been pre-completed for you

    // admin creates room
    cy.visit('create');

    cy.get('[aria-label="input-message-name"]').type('Cypress');
    cy.get('[aria-label="input-room-key"]').type('testkey');
    // eslint-disable-next-line max-len
    cy.get('[aria-label="input-question-responses"]').type('[{"prompt":"What is the best class at Dartmouth?","answer":"CS52"},{"prompt":"What is the best programming language?","answer":"JavaScript"},{"prompt":"What is the answer to Life, the Universe, and Everything","answer":"42"},{"prompt":"Are there any  more questions?","answer":"no"}]', { parseSpecialCharSequences: false });
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms`).as('post');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
      });

    cy.get('[aria-label="room-title"]').should('exist');
    cy.get('[aria-label="room-your-name"]').should('have.text', 'Cypress');
    cy.get('[aria-label="room-open-room-button"]').should('exist');
    cy.get('[aria-label="room-start-game-button"]').should('not.exist');
    cy.get('[aria-label="room-id"]').then(($value) => {
      roomId = $value.text();
    });

    // admin opens room
    cy.intercept('PATCH', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/*`).as('patch');
    cy.get('[aria-label="room-input-admin-key"]').type('testkey');
    cy.get('[aria-label="room-open-room-button"]').click();
    cy.wait('@patch')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
      });
    cy.get('[aria-label="room-open-room-button"]').should('not.exist');
    cy.get('[aria-label="room-start-game-button"]').should('exist');
  });
});

describe('Players join', () => {
  it('Alice joins the game', () => {
    cy.visit(`/join?room=${roomId}`);

    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/*`).as('post');
  });

  it('admin joins game, starts game, submits answer to first question (incorrect)', () => {
    // TODO

    // admin joins
    cy.visit(`/join?room=${roomId}`);

    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/*`).as('post');

    // admin starts game

    // admin submits answer to first question (incorrect)
  });
});

describe('Late players attempt to join', () => {
  it('Late player attempts to join and is denied entry', () => {
    // TODO
  });
});

describe('Remaining players submit answers to first question (index 0)', () => {
  it('Alice submits (correct)', () => {
    cy.visit(''); // root page of website
    cy.window().then((window) => {
      // Manually stub zustand state
      const state = JSON.parse(window.localStorage.getItem('kahoot-storage'));
      state.state.name = 'Alice';
      window.localStorage.setItem('kahoot-storage', JSON.stringify(state));
    });

    cy.visit(`/rooms/${roomId}`);
    // TODO
  });
});

describe('Players submit answers to 2nd question (index 1)', () => {
  it('admin submits (correct)', () => {
    cy.visit(''); // root page of website
    cy.window().then((window) => {
      // Manually stub zustand state
      const state = JSON.parse(window.localStorage.getItem('kahoot-storage'));
      state.state.name = 'Cypress';
      window.localStorage.setItem('kahoot-storage', JSON.stringify(state));
    });

    cy.visit(`/rooms/${roomId}`);
    // TODO
  });

  it('Alice submits (correct)', () => {
    cy.visit(''); // root page of website
    cy.window().then((window) => {
      // Manually stub zustand state
      const state = JSON.parse(window.localStorage.getItem('kahoot-storage'));
      state.state.name = 'Alice';
      window.localStorage.setItem('kahoot-storage', JSON.stringify(state));
    });

    cy.visit(`/rooms/${roomId}`);
    // TODO
  });
});

describe('Players submit answers to 3rd question (index 2)', () => {
  it('admin submits (incorrect)', () => {
    cy.visit(''); // root page of website
    cy.window().then((window) => {
      // Manually stub zustand state
      const state = JSON.parse(window.localStorage.getItem('kahoot-storage'));
      state.state.name = 'Cypress';
      window.localStorage.setItem('kahoot-storage', JSON.stringify(state));
    });

    cy.visit(`/rooms/${roomId}`);
    // TODO
  });

  it('Alice submits (correct)', () => {
    cy.visit(''); // root page of website
    cy.window().then((window) => {
      // Manually stub zustand state
      const state = JSON.parse(window.localStorage.getItem('kahoot-storage'));
      state.state.name = 'Alice';
      window.localStorage.setItem('kahoot-storage', JSON.stringify(state));
    });

    cy.visit(`/rooms/${roomId}`);
    // TODO
  });
});

describe('admin forces move on 4th question since Alice is AFK', () => {
  it('admin fails to force next move (missing key)', () => {
    cy.visit(''); // root page of website
    cy.window().then((window) => {
      // Manually stub zustand state
      const state = JSON.parse(window.localStorage.getItem('kahoot-storage'));
      state.state.name = 'Cypress';
      window.localStorage.setItem('kahoot-storage', JSON.stringify(state));
    });

    cy.visit(`/rooms/${roomId}`);
    // TODO
  });

  it('admin forces next move', () => {
    cy.visit(''); // root page of website
    cy.window().then((window) => {
      // Manually stub zustand state
      const state = JSON.parse(window.localStorage.getItem('kahoot-storage'));
      state.state.name = 'Cypress';
      window.localStorage.setItem('kahoot-storage', JSON.stringify(state));
    });

    cy.visit(`/rooms/${roomId}`);
    // TODO
  });
});

describe('Players check their final scores (game over, question -1)', () => {
  it('Alice checks their score', () => {
    cy.visit(''); // root page of website
    cy.window().then((window) => {
      // Manually stub zustand state
      const state = JSON.parse(window.localStorage.getItem('kahoot-storage'));
      state.state.name = 'Alice';
      window.localStorage.setItem('kahoot-storage', JSON.stringify(state));
    });

    cy.visit(`/rooms/${roomId}`);
    // TODO
  });

  it('admin checks their score', () => {
    cy.visit(''); // root page of website
    cy.window().then((window) => {
      // Manually stub zustand state
      const state = JSON.parse(window.localStorage.getItem('kahoot-storage'));
      state.state.name = 'Cypress';
      window.localStorage.setItem('kahoot-storage', JSON.stringify(state));
    });

    cy.visit(`/rooms/${roomId}`);
    // TODO
  });
});

describe('Player attempt to join room after game has ended', () => {
  it('Player attempt to join room after game has ended and is denied entry', () => {
    // TODO
  });
});
