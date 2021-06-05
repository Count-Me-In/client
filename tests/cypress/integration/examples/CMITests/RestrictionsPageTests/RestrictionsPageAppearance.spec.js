/// <reference types="cypress" />

context('Restrictions page appearance tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login')
    })
  
    it('We have correct page title', () => {
      cy.contains("Login")
    })
})