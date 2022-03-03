/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js"
import userEvent from '@testing-library/user-event'

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.style.backgroundColor).toBeDefined();

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("When I click on an eye", () => {
    test("Then the image of the bill should be shown", async () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const Bill = new Bills({
        document, onNavigate, store: null, localStorage
      })
      const handleClickIconEye = jest.fn((e) => Bill.handleClickIconEye(document.querySelector(`div[data-testid="icon-eye"]`)))
      let eyes = document.querySelectorAll(`div[data-testid="icon-eye"]`);

      eyes.forEach(eye => {
        eye.addEventListener('click', handleClickIconEye)
        eye.click()
      })
      
      expect(handleClickIconEye).toHaveBeenCalled();
      await waitFor(() => document.querySelector(".bill-proof-container"))
      expect(document.querySelector(".bill-proof-container")).toBeTruthy();
     
    })
  })

  describe("When I click on new bill", () => {
    test("Then form of new bill should appear", async () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const Bill = new Bills({
        document, onNavigate, store: null, localStorage
      })
      //const handleClickNewBill = jest.fn((e) => Bill.handleClickNewBill())
      const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
      buttonNewBill.click()

      expect(Bill.handleClickNewBill()).toHaveBeenCalled();
      await waitFor(() => document.querySelector(`form[data-testid="form-new-bill"]`))
      expect(document.querySelector("form-newbill-container content-inner")).toBeTruthy();
     
    })
  })
})
