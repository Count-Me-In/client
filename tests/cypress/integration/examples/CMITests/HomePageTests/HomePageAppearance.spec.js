/// <reference types="cypress" />

context('Home page appearance tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
        cy.get('[data-testid=nameField]').type('admin')
        cy.get('[data-testid=passwordField]').type('password')
        cy.get('[data-testid=loginBtn]').click()
    })

    it('We can see the logged in nav bar', () => {
        cy.contains("Count Me In The Office!")
        cy.contains("Points:")
        cy.get('[data-testid=scheduleLink]').should('exist')
        cy.get('[data-testid=biddingLink]').should('exist')
        cy.get('[data-testid=logoutBtn]').should('exist')
    })

    it('We can see the arrival schedule', () => {
        cy.get('[data-testid=arrivalScheduleCalander]').should('exist')
    })
})