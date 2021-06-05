/// <reference types="cypress" />

context('Bidding page functionality tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login')
      cy.get('[data-testid=nameField]').type('admin')
      cy.get('[data-testid=passwordField]').type('password')
      cy.get('[data-testid=loginBtn]').click()
      cy.get('[data-testid=biddingLink]').click()    
    })
})