/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from '@testing-library/user-event'
import store from "../__mocks__/store.js";
import localStorage from "../__mocks__/localStorage.js";
import { getByRole, fireEvent } from '@testing-library/dom';
import { ROUTES } from '../constants/routes.js'


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can't upload a file who are not jpg, jpeg or png", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const html = NewBillUI()
      document.body.innerHTML = html;
      const file = new File(['hello'], 'hello.gif', {type: 'image/gif'})
      const input = screen.getByLabelText(/Justificatif/i)
      new NewBill({ document, onNavigate, store, localStorage });
      userEvent.upload(input, file)
      
      expect(input.files[0]).toStrictEqual(file)
      expect(input.files).toHaveLength(1)
    
      expect(document.querySelector(`input[data-testid="file"]`).value).toEqual("");
    })

    test("Then I can submit my bill", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const html = NewBillUI()
      document.body.innerHTML = html;
      const file = new File(['hello'], 'hello.png', {type: 'image/png'})
      const input = screen.getByLabelText(/Justificatif/i)
      new NewBill({ document, onNavigate, store, localStorage });
      userEvent.upload(input, file)
      
      expect(input.files[0]).toStrictEqual(file)
      expect(input.files).toHaveLength(1)

      const handleSubmit = jest.fn();
      document.querySelector(`form[data-testid="form-new-bill"]`).onsubmit = handleSubmit;
      
      fireEvent.submit(document.querySelector(`form[data-testid="form-new-bill"]`));
      expect(handleSubmit).toHaveBeenCalledTimes(1);

    })

  })
})
