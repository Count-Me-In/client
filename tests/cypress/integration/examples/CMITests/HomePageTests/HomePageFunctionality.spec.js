/// <reference types="cypress" />

context('Home page functionality tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login')
      cy.get('[data-testid=nameField]').type('admin')
      cy.get('[data-testid=passwordField]').type('password')
      cy.get('[data-testid=loginBtn]').click()    
    })

    it('We can navigate the app through the nav bar', () => {
      cy.get('[data-testid=biddingLink]').click()
      cy.url().should('include', '/bidding')
      cy.get('[data-testid=scheduleLink]').click()
      cy.url().should('include', '/Home')
    })

})