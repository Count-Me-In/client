/// <reference types="cypress" />

context('Log in page appearance tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login')
    })
  
    it('We have correct page title', () => {
      cy.contains("Login")
    })

    it('We cant see the logged in nav bar', () => {
      cy.get('[data-testid=scheduleLink]').should('not.exist')
      cy.get('[data-testid=biddingLink]').should('not.exist')
      cy.get('[data-testid=managerPanelLink]').should('not.exist')
      cy.get('[data-testid=logoutBtn]').should('not.exist')
    })

    it('We can see the basic nav bar', () => {
      cy.contains("Count Me In The Office!")
      cy.get('[data-testid=InfoBtn]').should('exist')
    })

    it('We have log in fields', () => {
      cy.get('[data-testid=nameField]').should('exist')
      cy.get('[data-testid=passwordField]').should('exist')
    })

    it('We have login button', () => {
      cy.get('[data-testid=loginBtn]').should('exist')
    })
  })