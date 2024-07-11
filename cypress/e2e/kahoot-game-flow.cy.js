let roomId = '';

describe('Creating and opening a game with questions and answers', () => {
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
    cy.get('[aria-label="join-game-code-input-disabled"]').should('exist');
    cy.get('[aria-label="join-game-code-input"]').should('not.exist');
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/*`).as('post');
    cy.get('[aria-label="join-game-name-input"]').type('Alice');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
      });

    cy.get('[aria-label="room-title"]').should('exist');
    cy.get('[aria-label="room-your-name"]').should('have.text', 'Alice');
    cy.get('[aria-label="room-open-room-button"]').should('not.exist');
    cy.get('[aria-label="room-start-game-button"]').should('not.exist');
    cy.get('[aria-label="room-id"]').should('have.text', roomId);
    cy.get('[aria-label="player-entry-Alice').should('have.text', 'Alice');
  });

  it('admin joins game, starts game, submits answer to first question (incorrect)', () => {
    // admin joins
    cy.visit(`/join?room=${roomId}`);
    cy.get('[aria-label="join-game-code-input-disabled"]').should('exist');
    cy.get('[aria-label="join-game-code-input"]').should('not.exist');
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/*`).as('post');
    cy.get('[aria-label="join-game-name-input"]').type('Cypress');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
      });

    cy.get('[aria-label="room-title"]').should('exist');
    cy.get('[aria-label="room-your-name"]').should('have.text', 'Cypress');
    cy.get('[aria-label="room-open-room-button"]').should('not.exist');
    cy.get('[aria-label="room-start-game-button"]').should('exist');
    cy.get('[aria-label="room-id"]').should('have.text', roomId);
    cy.get('[aria-label="player-entry-Alice').should('have.text', 'Alice');
    cy.get('[aria-label="player-entry-Cypress').should('have.text', 'Cypress');

    // admin starts game
    cy.intercept('PATCH', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/*`).as('patch');
    cy.get('[aria-label="room-input-admin-key"]').type('testkey');
    cy.get('[aria-label="room-start-game-button"]').click();
    cy.wait('@patch')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
      });
    cy.wait(1000);

    cy.get('[aria-label="question-heading"]').should('have.text', 'Question #1: What is the best class at Dartmouth?');
    cy.get('[aria-label="force-answers-button"]').should('exist');

    // admin submits answer to first question (incorrect)
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/${roomId}/submissions`).as('post');
    cy.get('[aria-label="question-answer-input"]').type('Not CS52');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
        expect(res.response.body.correct).to.eq(false);
        expect(res.response.body.questionNumber).to.eq(0);
      });
    cy.get('[aria-label="question-result"]').should('have.text', 'Incorrect');
  });
});

describe('Late players attempt to join', () => {
  it('Late player attempts to join and is denied entry', () => {
    cy.visit(`/join?room=${roomId}`);
    cy.get('[aria-label="join-game-code-input-disabled"]').should('exist');
    cy.get('[aria-label="join-game-code-input"]').should('not.exist');
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/*`).as('post');
    cy.get('[aria-label="join-game-name-input"]').type('George');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(422);
        cy.get('div[aria-live="polite"]').should('exist');
      });
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
    cy.get('[aria-label="question-heading"]').should('have.text', 'Question #1: What is the best class at Dartmouth?');
    cy.get('[aria-label="force-answers-button"]').should('not.exist');
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/${roomId}/submissions`).as('post');
    cy.get('[aria-label="question-answer-input"]').type('CS52');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
        expect(res.response.body.correct).to.eq(true);
        expect(res.response.body.questionNumber).to.eq(0);
      });
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
    cy.wait(1000);
    cy.get('[aria-label="question-heading"]').should('have.text', 'Question #2: What is the best programming language?');
    cy.get('[aria-label="force-answers-button"]').should('exist');
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/${roomId}/submissions`).as('post');
    cy.get('[aria-label="question-answer-input"]').type('JavaScript');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
        expect(res.response.body.correct).to.eq(true);
        expect(res.response.body.questionNumber).to.eq(1);
      });
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
    cy.get('[aria-label="question-heading"]').should('have.text', 'Question #2: What is the best programming language?');
    cy.get('[aria-label="force-answers-button"]').should('not.exist');
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/${roomId}/submissions`).as('post');
    cy.get('[aria-label="question-answer-input"]').type('JavaScript');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
        expect(res.response.body.correct).to.eq(true);
        expect(res.response.body.questionNumber).to.eq(1);
      });
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
    cy.get('[aria-label="question-heading"]').should('have.text', 'Question #3: What is the answer to Life, the Universe, and Everything');
    cy.get('[aria-label="force-answers-button"]').should('exist');
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/${roomId}/submissions`).as('post');
    cy.get('[aria-label="question-answer-input"]').type('Cheese');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
        expect(res.response.body.correct).to.eq(false);
        expect(res.response.body.questionNumber).to.eq(2);
      });
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
    cy.get('[aria-label="question-heading"]').should('have.text', 'Question #3: What is the answer to Life, the Universe, and Everything');
    cy.get('[aria-label="force-answers-button"]').should('not.exist');
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/${roomId}/submissions`).as('post');
    cy.get('[aria-label="question-answer-input"]').type('42');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
        expect(res.response.body.correct).to.eq(true);
        expect(res.response.body.questionNumber).to.eq(2);
      });
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
    cy.get('[aria-label="force-answers-input"]').should('exist');
    cy.get('[aria-label="force-answers-button"]').should('exist');
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/${roomId}/submissions`).as('post');
    cy.get('[aria-label="force-answers-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(422);
        cy.get('div[aria-live="polite"]').should('exist');
      });
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
    cy.get('[aria-label="force-answers-input"]').should('exist');
    cy.get('[aria-label="force-answers-button"]').should('exist');
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/${roomId}/submissions`).as('post');
    cy.get('[aria-label="force-answers-input"]').type('testkey');
    cy.get('[aria-label="force-answers-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(200);
      });
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
    cy.get('[aria-label="room-title"]').should('have.text', 'Game has ended');
    cy.get('[aria-label="your-rank"]').should('have.text', 'Your rank: 1');
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
    cy.get('[aria-label="room-title"]').should('have.text', 'Game has ended');
    cy.get('[aria-label="your-rank"]').should('have.text', 'Your rank: 2');
  });
});

describe('Player attempt to join room after game has ended', () => {
  it('Player attempt to join room after game has ended and is denied entry', () => {
    cy.visit(`/join?room=${roomId}`);
    cy.get('[aria-label="join-game-code-input-disabled"]').should('exist');
    cy.get('[aria-label="join-game-code-input"]').should('not.exist');
    cy.intercept('POST', `${Cypress.env('VITE_REACT_APP_BASE_API_URL')}rooms/*`).as('post');
    cy.get('[aria-label="join-game-name-input"]').type('George');
    cy.get('[aria-label="submit-button"]').click();
    cy.wait('@post')
      .then((res) => {
        expect(res.response.statusCode).to.eq(422);
        cy.get('div[aria-live="polite"]').should('exist');
      });
  });
});
