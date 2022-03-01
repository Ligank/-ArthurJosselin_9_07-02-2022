/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import {handleChangeFile} from "../containers/NewBill.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can't upload a file who are not jpg, jpeg or png", () => {
      const html = NewBillUI()
      document.body.innerHTML = html;
      let ext = this.document.querySelector(`input[data-testid="file"]`).value.match(/\.([^\.]+)$/)[1];
      
      
      expect(ext == 'image/png').toBeTruthy();
    })
  })
})
