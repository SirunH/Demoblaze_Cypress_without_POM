/// <reference types="cypress" />
const data = require("../support/data")

describe('API testing', () => {
        it('Add item to card using API requests', () => {
            cy.visit('https://www.demoblaze.com')
            cy.request('/').its('status').should('be.equal', 200)

            cy.title().should('include', 'STORE')
            cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
            cy.window().should('have.property', 'top') //Too many assertions here are just experiments

            cy.intercept('https://hls.demoblaze.com/about_demo_hls_600k00000.ts').as('view')

            cy.getCookie('user').then((cookie) => {
                cy.wrap(`${cookie.name}=${cookie.value}`).as('cookie')
            })

            cy.wait('@view')

            cy.get('@cookie').then(el => {
                cy.request('POST', 'https://api.demoblaze.com/addtocart', {
                    'id': data.userID(),
                    'cookie': el,
                    'prod_id': 1,
                    'flag': false
                })
            })
            cy.get('#cartur').click()

            cy.wait('@view')

            cy.get("#totalp").then(price => {
                expect(price.text()).to.be.equal("360");
            })
        })
    })
    //have a problem with the beautifier, will correct it later