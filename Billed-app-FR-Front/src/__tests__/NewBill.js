/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import {handleChangeFile} from "../containers/NewBill.js"
import NewBill from "../containers/NewBill.js"
import {image} from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can't upload a file who are not jpg, jpeg or png", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const html = NewBillUI()
      document.body.innerHTML = html;
      new NewBill({ document, onNavigate, store: null, localStorage }).handleChangeFile();
    
      expect(image).toBeFalsy();
    })
  })
})
