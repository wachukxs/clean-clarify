describe('Test correctness', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001')
    })
  
    it('submit a delivery time', () => {
      cy.get('input[placeholder="mm/dd/yyyy"]').type('12/23/2021')

      cy.get('#delivery-time-select').click()
      cy.get('li[data-value="12:30"]').click()

      cy.get('#submit-button').click()
    })
  
  
  })
  