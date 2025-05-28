const API = `https://norma.nomoreparties.space/api`;
const BUN_A = `[data-cy="643d69a5c3f7b9001cfa093c"]`;
const BUN_B = `[data-cy="643d69a5c3f7b9001cfa093d"]`;
const FILLING_ID = '643d69a5c3f7b9001cfa0941';
const FILLING = `[data-cy="${FILLING_ID}"]`;

beforeEach(() => {
  cy.intercept('GET', `${API}/ingredients`, {
    fixture: 'ingredientsMock.json'
  });
  cy.intercept('POST', `${API}/auth/login`, { fixture: 'userMock.json' });
  cy.intercept('GET', `${API}/auth/user`, { fixture: 'userMock.json' });
  cy.intercept('POST', `${API}/orders`, { fixture: 'orderMock.json' });

  cy.visit('/');
  cy.get('#modals').as('modalRef');

  cy.fixture('ingredientsMock.json').as('ingredientsData');
});

describe('Работа с ингредиентами в заказе', () => {
  it('увеличение счётчика при добавлении начинки', function () {
    cy.get(FILLING).find('button').click();
    cy.get(FILLING).find('.counter__num').should('contain', '1');

    const fillingName = this.ingredientsData.data.find(
      (el: { _id: string }) => el._id === FILLING_ID
    ).name;

    cy.get("[data-cy='burger-constructor']").should('contain', fillingName);
  });

  it('добавление булки и начинки', () => {
    cy.get(BUN_A).find('button').click();
    cy.get(FILLING).find('button').click();
  });

  it('сначала начинка, потом булка', () => {
    cy.get(FILLING).find('button').click();
    cy.get(BUN_A).find('button').click();
  });

  it('замена булки без начинки', () => {
    cy.get(BUN_A).find('button').click();

    cy.get(`[data-cy='constructor-pos-top']`).as('topBun');
    cy.get('@topBun').should('contain', 'Краторная булка N-200i');

    cy.get(BUN_B).find('button').click();
    cy.get('@topBun').should('contain', 'Флюоресцентная булка R2-D3');
  });

  it('замена булки при наличии начинки', () => {
    cy.get(BUN_A).find('button').click();
    cy.get(FILLING).find('button').click();
    cy.get(BUN_B).find('button').click();
    cy.get(`[data-cy='constructor-pos-top']`).should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    localStorage.setItem('refreshToken', 'someRefreshToken');
    cy.setCookie('accessToken', 'someAccessToken');
  });

  afterEach(() => {
    localStorage.clear();
    cy.clearAllCookies();
  });

  it('успешный заказ и сброс конструктора', () => {
    cy.get(BUN_A).find('button').click();
    cy.get(FILLING).find('button').click();

    cy.get(`[data-cy='order-button']`).click();
    cy.get(`[data-cy='login-button']`).click();
    cy.get(`[data-cy='order-button']`).click();

    cy.get('@modalRef').find('h2').should('contain', '77777');
    cy.get('@modalRef').find('button').click();
    cy.get('@modalRef').should('be.empty');

    cy.get(`[data-cy='burger-constructor']`).should(
      'contain',
      'Выберите булки'
    );
    cy.get(`[data-cy='burger-constructor']`).should(
      'contain',
      'Выберите начинку'
    );
  });
});

describe('Модальные окна', () => {
  it('открытие окна ингредиента', function () {
    cy.get('@modalRef').should('be.empty');
    cy.get(FILLING).find('a').click();
    cy.get('@modalRef').should('exist');

    const fillingName = this.ingredientsData.data.find(
      (el: { _id: string }) => el._id === FILLING_ID
    ).name;
    cy.get('@modalRef').should('contain', fillingName);
  });

  it('закрытие модалки по кнопке', () => {
    cy.get(FILLING).find('a').click();
    cy.get('@modalRef').find('button').click();
    cy.get('@modalRef').should('be.empty');
  });

  it('закрытие модалки по оверлею', () => {
    cy.get(FILLING).find('a').click();
    cy.get(`[data-cy='overlay']`).click({ force: true });
    cy.get('@modalRef').should('be.empty');
  });

  it('закрытие модалки по клавише Escape', () => {
    cy.get(FILLING).find('a').click();
    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@modalRef').should('be.empty');
  });
});
