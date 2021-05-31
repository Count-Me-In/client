/// <reference types="cypress" />

context('Log in page functionality tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  it('We Can log in with correct user info', () => {
    cy.get('[data-testid=nameField]').type('admin')
    cy.get('[data-testid=passwordField]').type('password')
    cy.get('[data-testid=loginBtn]').click()
    cy.url().should('include', '/home') 
  })

  it('We cant login without all the user info', () => {
    cy.get('[data-testid=loginBtn]').click()
    cy.url().should('include', '/login')
    cy.get('[data-testid=loginAlert]').should('exist')

    cy.get('[data-testid=nameField]').type('admin')
    cy.get('[data-testid=loginBtn]').click()
    cy.get('[data-testid=loginAlert]').should('exist')

    cy.get('[data-testid=nameField]').clear()   
    cy.get('[data-testid=passwordField]').type('admin')
    cy.get('[data-testid=loginBtn]').click()
    cy.get('[data-testid=loginAlert]').should('exist')
  })

  it('We can press the INFO button', () => {
    cy.get('[data-testid=InfoBtn]').click()
    cy.get('[data-testid=infoBtnText]').should('exist')
  })
})