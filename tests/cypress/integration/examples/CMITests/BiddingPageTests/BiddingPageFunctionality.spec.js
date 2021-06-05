/// <reference types="cypress" />

context('Bidding page functionality tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
    cy.get('[data-testid=nameField]').type('admin')
    cy.get('[data-testid=passwordField]').type('password')
    cy.get('[data-testid=loginBtn]').click()
    cy.get('[data-testid=biddingLink]').click()    
  })

  it('We can save bidding', () => {
    cy.get('[data-testid=biddingSlots]').type("50")
    cy.get('[data-testid=saveBiddingBtn]').click()
    cy.get('[data-testid=percentsSlots]').invoke('val').then(sometext => 
      expect(sometext).to.eq("50")
    )
  })
})