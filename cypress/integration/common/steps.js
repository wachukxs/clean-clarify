import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

Given("I go to order page", () => {
    cy.visit('http://localhost:3001')
})

// 12/23/2021

// cy.get('ul[aria-labelledby="delivery-time-select-label"]')

Given(`System has {string} orders on {string} at {string}`, (n, date, time) => {
    for (let index = 0; index < parseInt(n); index++) {
        cy.get('input[placeholder="mm/dd/yyyy"]').type(date)

        cy.get('#delivery-time-select').click()
        cy.get(`li[data-value="${time}"]`).click()

        cy.get('#submit-button').click()

    }
})

Given("User checks delivery times for {string}", (date) => {

    cy.get('input[placeholder="mm/dd/yyyy"]').type(date)

})

Then("System will show {string} and {string} delivery times", (time1, time2) => {

    cy.get('#delivery-time-select').click()

    cy.get('ul[aria-labelledby="delivery-time-select-label"]')
        .find(`li[data-value="${time1}"]`)
        .should('be.visible')

    cy.get('ul[aria-labelledby="delivery-time-select-label"]')
        .find(`li[data-value="${time2}"]`)
        .should('be.visible')

})

Then("System will show {string} and {string} and {string} delivery times", (time1, time2, time3) => {

    cy.get('#delivery-time-select').click()

    cy.get('ul[aria-labelledby="delivery-time-select-label"]')
        .find(`li[data-value="${time1}"]`)
        .should('be.visible')

    cy.get('ul[aria-labelledby="delivery-time-select-label"]')
        .find(`li[data-value="${time2}"]`)
        .should('be.visible')

    cy.get('ul[aria-labelledby="delivery-time-select-label"]')
        .find(`li[data-value="${time3}"]`)
        .should('be.visible')

})

Then("System will not show {string} delivery time", (time1) => {

    cy.get('#delivery-time-select').then(_div => {
        if (!_div.is(':visible')) {
            cy.get('#delivery-time-select').click()
        }

        cy.get('ul[aria-labelledby="delivery-time-select-label"]')
            .find(`li[data-value="${time1}"]`)
            .should('not.exist')
    })

})

Given("System has no orders for {string}", (date) => {

    cy.get('#reset-button')

    cy.get('input[placeholder="mm/dd/yyyy"]').type(date)

})
// 