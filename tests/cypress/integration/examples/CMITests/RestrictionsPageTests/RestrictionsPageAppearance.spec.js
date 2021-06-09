/// <reference types="cypress" />

context('Restrictions page appearance tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login')
      cy.get('[data-testid=nameField]').type('admin')
      cy.get('[data-testid=passwordField]').type('password')
      cy.get('[data-testid=loginBtn]').click()
      cy.get('[data-testid=managerPanelLink]').click() 
      cy.contains("Days restriction").click()  
    })
  
    it('We can see the logged in nav bar', () => {
      cy.contains("Count Me In The Office!")
      cy.contains("Points:")
      cy.get('[data-testid=scheduleLink]').should('exist')
      cy.get('[data-testid=biddingLink]').should('exist')
      cy.get('[data-testid=logoutBtn]').should('exist')
    })

    it('We have correct page title', () => {
      cy.contains("Days Restrictions")
    })

    it('We can see days for restrictions', () => {
      cy.contains("Pick days for your worker")
    })
})