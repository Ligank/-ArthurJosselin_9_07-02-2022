/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can't upload a file who are not jpg, jpeg or png", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
      const file = document.querySelector(`input[data-testid="file"]`).files[0]
      
      expect(file.type == 'image/png').toBeTruthy();
    })
  })
})
