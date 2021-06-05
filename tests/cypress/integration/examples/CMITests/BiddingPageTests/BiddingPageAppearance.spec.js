/// <reference types="cypress" />

context('Bidding page appearance tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
    cy.get('[data-testid=nameField]').type('admin')
    cy.get('[data-testid=passwordField]').type('password')
    cy.get('[data-testid=loginBtn]').click()
    cy.get('[data-testid=biddingLink]').click()
  })

  it('We can see the logged in nav bar', () => {
    cy.contains("Count Me In The Office!")
    cy.contains("points:")
    cy.get('[data-testid=scheduleLink]').should('exist')
    cy.get('[data-testid=biddingLink]').should('exist')
    cy.get('[data-testid=managerPanelLink]').should('exist')
    cy.get('[data-testid=logoutBtn]').should('exist')
  })

  it('We can see the bidding calendar', () => {
    cy.contains("9:00 AM")
    cy.contains("10:00 AM")
    cy.contains("11:00 AM")
    cy.contains("12:00 PM")
    cy.contains("1:00 PM")
    cy.contains("2:00 PM")
    cy.contains("3:00 PM")
    cy.contains("4:00 PM")
    cy.contains("5:00 PM")
    cy.contains("6:00 PM")
    cy.contains("Sun")
    cy.contains("Mon")
    cy.contains("Tue")
    cy.contains("Wed")
    cy.contains("Thu")
    cy.contains("Fri")
    cy.get('[data-testid=biddingCalendar]').should('exist')
  })

  it('We can see the bidding slots with all the functionality', () => {
    cy.get('[data-testid=biddingSlots]').should('exist')
    cy.get('[data-testid=inviteFriend]').should('exist')
    cy.get('[data-testid=percentsSlots]').should('exist')
  })

  it('We can see the Save Biddings button', () => {
    cy.get('[data-testid=saveBiddingBtn]').should('exist')
  })
})