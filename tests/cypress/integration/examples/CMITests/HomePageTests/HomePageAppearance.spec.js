/// <reference types="cypress" />

context('Log in page appearance tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
    })

    it('We can see the logged in nav bar', () => {
        cy.contains("Count Me In The Office!")
        cy.contains("points:")
        cy.get('[data-testid=scheduleLink]').should('exist')
        cy.get('[data-testid=biddingLink]').should('exist')
        cy.get('[data-testid=managerPanelLink]').should('exist')
        cy.get('[data-testid=logoutBtn]').should('exist')
    })

    it('We can see the arrival schedule', () => {
        cy.get('[data-testid=arrivalScheduleCalander]').should('exist')
    })

    // it('We can see the dates navigations ')
})