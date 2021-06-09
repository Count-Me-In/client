/// <reference types="cypress" />

context('Employee Points page appearance tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login')
      cy.get('[data-testid=nameField]').type('admin')
      cy.get('[data-testid=passwordField]').type('password')
      cy.get('[data-testid=loginBtn]').click()
      cy.get('[data-testid=managerPanelLink]').click() 
      cy.contains("Employees points").click()    
    })

    it('We can navigate the app through the nav bar', () => {
      cy.get('[data-testid=scheduleLink]').click()
      cy.url().should('include', '/Home')
      cy.get('[data-testid=managerPanelLink]').click() 
      cy.contains("Days restriction").click()
    })
})